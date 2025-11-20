import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { invokeLLM } from "./_core/llm";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Restaurant management
  restaurant: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      return await db.getRestaurantByUserId(ctx.user.id);
    }),
    
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        description: z.string().optional(),
        address: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().optional(),
        openingHours: z.string().optional(),
        cuisine: z.string().optional(),
        logoUrl: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Check if restaurant already exists
        const existing = await db.getRestaurantByUserId(ctx.user.id);
        if (existing) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Restaurant already exists' });
        }
        
        await db.createRestaurant({
          userId: ctx.user.id,
          ...input,
        });
        
        return { success: true };
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        address: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().optional(),
        openingHours: z.string().optional(),
        cuisine: z.string().optional(),
        logoUrl: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        
        // Verify ownership
        const restaurant = await db.getRestaurantByUserId(ctx.user.id);
        if (!restaurant || restaurant.id !== id) {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }
        
        await db.updateRestaurant(id, data);
        return { success: true };
      }),
  }),

  // Menu management
  menu: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const restaurant = await db.getRestaurantByUserId(ctx.user.id);
      if (!restaurant) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Restaurant not found' });
      }
      
      return await db.getMenuItemsByRestaurant(restaurant.id);
    }),
    
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        description: z.string().optional(),
        category: z.string().optional(),
        price: z.number(),
        imageUrl: z.string().optional(),
        available: z.boolean().optional(),
        allergens: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const restaurant = await db.getRestaurantByUserId(ctx.user.id);
        if (!restaurant) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Restaurant not found' });
        }
        
        await db.createMenuItem({
          restaurantId: restaurant.id,
          ...input,
        });
        
        return { success: true };
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        category: z.string().optional(),
        price: z.number().optional(),
        imageUrl: z.string().optional(),
        available: z.boolean().optional(),
        allergens: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        await db.updateMenuItem(id, data);
        return { success: true };
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteMenuItem(input.id);
        return { success: true };
      }),
  }),

  // Booking management
  booking: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const restaurant = await db.getRestaurantByUserId(ctx.user.id);
      if (!restaurant) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Restaurant not found' });
      }
      
      return await db.getBookingsByRestaurant(restaurant.id);
    }),
    
    create: publicProcedure
      .input(z.object({
        restaurantId: z.number(),
        customerName: z.string(),
        customerEmail: z.string().optional(),
        customerPhone: z.string(),
        bookingDate: z.date(),
        numberOfGuests: z.number(),
        specialRequests: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createBooking({
          ...input,
          status: 'pending',
        });
        
        return { success: true };
      }),
    
    updateStatus: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
      }))
      .mutation(async ({ input }) => {
        await db.updateBooking(input.id, { status: input.status });
        return { success: true };
      }),
  }),

  // Chat with AI
  chat: router({
    sendMessage: publicProcedure
      .input(z.object({
        sessionId: z.string(),
        message: z.string(),
        restaurantId: z.number(),
      }))
      .mutation(async ({ input }) => {
        const { sessionId, message, restaurantId } = input;
        
        // Get or create conversation
        let conversation = await db.getChatConversationBySessionId(sessionId);
        
        if (!conversation) {
          await db.createChatConversation({
            restaurantId,
            sessionId,
            status: 'active',
          });
          conversation = await db.getChatConversationBySessionId(sessionId);
        }
        
        if (!conversation) {
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create conversation' });
        }
        
        // Save user message
        await db.createChatMessage({
          conversationId: conversation.id,
          role: 'user',
          content: message,
        });
        
        // Get conversation history
        const history = await db.getChatMessagesByConversation(conversation.id);
        
        // Get menu items for context
        const menuItems = await db.getMenuItemsByRestaurant(restaurantId);
        
        // Build context for GPT-4
        const systemPrompt = `Sei un assistente virtuale intelligente per un ristorante italiano. 
Il tuo nome è RistoAI e sei qui per aiutare i clienti con:
- Informazioni sui piatti del menu
- Prenotazioni di tavoli
- Domande sugli orari e sulla location
- Suggerimenti personalizzati

Menu disponibile:
${menuItems.map(item => `- ${item.name} (€${(item.price / 100).toFixed(2)}): ${item.description || 'Nessuna descrizione'}`).join('\n')}

Rispondi in modo cordiale, professionale e in italiano. Se il cliente vuole prenotare, chiedi nome, numero di telefono, data, ora e numero di persone.`;
        
        // Call GPT-4
        const response = await invokeLLM({
          messages: [
            { role: 'system', content: systemPrompt },
            ...history.slice(-10).map(msg => ({
              role: msg.role as 'user' | 'assistant' | 'system',
              content: msg.content,
            })),
          ],
        });
        
        const rawContent = response.choices[0]?.message?.content;
        const assistantMessage = typeof rawContent === 'string' 
          ? rawContent 
          : 'Mi dispiace, non ho capito. Puoi ripetere?';
        
        // Save assistant response
        await db.createChatMessage({
          conversationId: conversation.id,
          role: 'assistant',
          content: assistantMessage,
        });
        
        return {
          message: assistantMessage,
          conversationId: conversation.id,
        };
      }),
    
    getHistory: publicProcedure
      .input(z.object({
        sessionId: z.string(),
      }))
      .query(async ({ input }) => {
        const conversation = await db.getChatConversationBySessionId(input.sessionId);
        
        if (!conversation) {
          return [];
        }
        
        return await db.getChatMessagesByConversation(conversation.id);
      }),
    
    listConversations: protectedProcedure.query(async ({ ctx }) => {
      const restaurant = await db.getRestaurantByUserId(ctx.user.id);
      if (!restaurant) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Restaurant not found' });
      }
      
      return await db.getChatConversationsByRestaurant(restaurant.id);
    }),
  }),

  // Analytics
  analytics: router({
    get: protectedProcedure
      .input(z.object({
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      }))
      .query(async ({ ctx, input }) => {
        const restaurant = await db.getRestaurantByUserId(ctx.user.id);
        if (!restaurant) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Restaurant not found' });
        }
        
        return await db.getAnalyticsByRestaurant(restaurant.id, input.startDate, input.endDate);
      }),
    
    getDashboardStats: protectedProcedure.query(async ({ ctx }) => {
      const restaurant = await db.getRestaurantByUserId(ctx.user.id);
      if (!restaurant) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Restaurant not found' });
      }
      
      const bookings = await db.getBookingsByRestaurant(restaurant.id);
      const conversations = await db.getChatConversationsByRestaurant(restaurant.id);
      const menuItems = await db.getMenuItemsByRestaurant(restaurant.id);
      
      // Calculate stats
      const totalBookings = bookings.length;
      const pendingBookings = bookings.filter(b => b.status === 'pending').length;
      const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
      const totalConversations = conversations.length;
      const activeConversations = conversations.filter(c => c.status === 'active').length;
      const totalMenuItems = menuItems.length;
      const availableMenuItems = menuItems.filter(m => m.available).length;
      
      return {
        bookings: {
          total: totalBookings,
          pending: pendingBookings,
          confirmed: confirmedBookings,
        },
        conversations: {
          total: totalConversations,
          active: activeConversations,
        },
        menu: {
          total: totalMenuItems,
          available: availableMenuItems,
        },
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;
