INSERT INTO restaurants (id, userId, name, description, address, phone, email, openingHours, cuisine, logoUrl) 
VALUES (1, 1, 'Trattoria La Pergola', 'Autentica cucina italiana con ingredienti freschi e ricette tradizionali', 'Via Roma 123, Milano, Italia', '+39 02 1234567', 'info@lapergola.it', '{"lunedi":"12:00-15:00, 19:00-23:00"}', 'Italiana', 'https://placehold.co/200x200/D97850/2D1810?text=LP')
ON DUPLICATE KEY UPDATE name='Trattoria La Pergola';

INSERT INTO menu_items (restaurantId, name, description, category, price, available, allergens) VALUES
(1, 'Bruschetta al Pomodoro', 'Pane tostato con pomodori freschi, basilico e olio d\'oliva', 'Antipasti', 850, 1, '["glutine"]'),
(1, 'Caprese', 'Mozzarella di bufala, pomodori e basilico fresco', 'Antipasti', 1200, 1, '["lattosio"]'),
(1, 'Spaghetti alla Carbonara', 'Pasta fresca con guanciale, uova e pecorino romano', 'Primi', 1400, 1, '["glutine","uova","lattosio"]'),
(1, 'Risotto ai Funghi Porcini', 'Risotto cremoso con funghi porcini freschi', 'Primi', 1600, 1, '["lattosio"]'),
(1, 'Ossobuco alla Milanese', 'Stinco di vitello brasato con gremolata', 'Secondi', 2200, 1, '[]'),
(1, 'Tagliata di Manzo', 'Manzo alla griglia con rucola e grana', 'Secondi', 2400, 1, '["lattosio"]'),
(1, 'Tiramisù', 'Classico dolce italiano con mascarpone e caffè', 'Dolci', 700, 1, '["glutine","uova","lattosio"]'),
(1, 'Panna Cotta', 'Dolce al cucchiaio con coulis di frutti di bosco', 'Dolci', 650, 1, '["lattosio"]');
