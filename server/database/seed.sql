INSERT INTO users (first_name, last_name, email, password, phone)
VALUES
('John', 'Pasea', 'john@example.com', 'password123', '0712345678'),
('Alice', 'Otieno', 'alice@example.com', '0723456789', '0723456789'),
('Brian', 'Mwangi', 'brian@example.com', '0734567890', '0734567890');

INSERT INTO assets
(owner_id, title, description, category, price_per_day, location)

VALUES

(
1,
'Luxury Apartment',
'2 Bedroom Apartment with WiFi and Parking',
'Property',
3500,
'Nairobi'
),

(
2,
'Toyota Prado',
'Well maintained SUV',
'Vehicle',
8000,
'Mombasa'
),

(
3,
'Canon EOS R6',
'Professional mirrorless camera',
'Electronics',
2000,
'Kisumu'
),

(
1,
'Bosch Hammer Drill',
'Heavy duty drill for construction',
'Tools',
800,
'Nakuru'
),

(
2,
'Office Desk',
'Modern wooden office desk',
'Furniture',
600,
'Eldoret'
);