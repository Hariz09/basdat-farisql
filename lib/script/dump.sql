-- 1. USER_ACCOUNT
CREATE TABLE USER_ACCOUNT (
    user_id UUID PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- 2. ROLE
CREATE TABLE ROLE (
    role_id UUID PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL
);

-- 3. ACCOUNT_ROLE
CREATE TABLE ACCOUNT_ROLE (
    role_id UUID,
    user_id UUID,
    PRIMARY KEY (role_id, user_id),
    FOREIGN KEY (role_id) REFERENCES ROLE(role_id),
    FOREIGN KEY (user_id) REFERENCES USER_ACCOUNT(user_id)
);

-- 4. CUSTOMER
CREATE TABLE CUSTOMER (
    customer_id UUID PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    user_id UUID UNIQUE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES USER_ACCOUNT(user_id)
);

-- 5. ORGANIZER
CREATE TABLE ORGANIZER (
    organizer_id UUID PRIMARY KEY,
    organizer_name VARCHAR(100) NOT NULL,
    contact_email VARCHAR(100),
    user_id UUID UNIQUE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES USER_ACCOUNT(user_id)
);

-- 6. VENUE
CREATE TABLE VENUE (
    venue_id UUID PRIMARY KEY,
    venue_name VARCHAR(100) NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL
);

-- 7. SEAT
CREATE TABLE SEAT (
    seat_id UUID PRIMARY KEY,
    section VARCHAR(50) NOT NULL,
    seat_number VARCHAR(10) NOT NULL,
    row_number VARCHAR(10) NOT NULL,
    venue_id UUID NOT NULL,
    FOREIGN KEY (venue_id) REFERENCES VENUE(venue_id)
);

-- 8. EVENT
CREATE TABLE EVENT (
    event_id UUID PRIMARY KEY,
    event_datetime TIMESTAMP NOT NULL,
    event_title VARCHAR(200) NOT NULL,
    venue_id UUID NOT NULL,
    organizer_id UUID NOT NULL,
    FOREIGN KEY (venue_id) REFERENCES VENUE(venue_id),
    FOREIGN KEY (organizer_id) REFERENCES ORGANIZER(organizer_id)
);

-- 9. ARTIST
CREATE TABLE ARTIST (
    artist_id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    genre VARCHAR(100)
);

-- 10. EVENT_ARTIST
CREATE TABLE EVENT_ARTIST (
    event_id UUID,
    artist_id UUID,
    role VARCHAR(100),
    PRIMARY KEY (event_id, artist_id),
    FOREIGN KEY (event_id) REFERENCES EVENT(event_id),
    FOREIGN KEY (artist_id) REFERENCES ARTIST(artist_id)
);

-- 11. TICKET_CATEGORY
CREATE TABLE TICKET_CATEGORY (
    category_id UUID PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL,
    quota INTEGER NOT NULL CHECK (quota > 0),
    price NUMERIC(12,2) NOT NULL CHECK (price >= 0),
    tevent_id UUID NOT NULL,
    FOREIGN KEY (tevent_id) REFERENCES EVENT(event_id)
);

-- 14. orders
CREATE TABLE orders (
    order_id UUID PRIMARY KEY,
    order_date TIMESTAMP NOT NULL,
    payment_status VARCHAR(20) NOT NULL,
    total_amount NUMERIC(12,2) NOT NULL CHECK (total_amount >= 0),
    customer_id UUID NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES CUSTOMER(customer_id)
);

-- 12. TICKET
CREATE TABLE TICKET (
    ticket_id UUID PRIMARY KEY,
    ticket_code VARCHAR(100) UNIQUE NOT NULL,
    tcategory_id UUID NOT NULL,
    torder_id UUID NOT NULL,
    FOREIGN KEY (tcategory_id) REFERENCES TICKET_CATEGORY(category_id),
    FOREIGN KEY (torder_id) REFERENCES orders(order_id)
);

-- 13. HAS_RELATIONSHIP
CREATE TABLE HAS_RELATIONSHIP (
    seat_id UUID,
    ticket_id UUID,
    PRIMARY KEY (seat_id, ticket_id),
    FOREIGN KEY (seat_id) REFERENCES SEAT(seat_id),
    FOREIGN KEY (ticket_id) REFERENCES TICKET(ticket_id)
);

-- 15. PROMOTION
CREATE TABLE PROMOTION (
    promotion_id UUID PRIMARY KEY,
    promo_code VARCHAR(50) UNIQUE NOT NULL,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('NOMINAL', 'PERCENTAGE')),
    discount_value NUMERIC(12,2) NOT NULL CHECK (discount_value > 0),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    usage_limit INTEGER NOT NULL CHECK (usage_limit > 0)
);

-- 16. ORDER_PROMOTION
CREATE TABLE ORDER_PROMOTION (
    order_promotion_id UUID PRIMARY KEY,
    promotion_id UUID NOT NULL,
    order_id UUID NOT NULL,
    FOREIGN KEY (promotion_id) REFERENCES PROMOTION(promotion_id),
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);



-- =======================
-- 2. DML (Dummy Data)
-- =======================

INSERT INTO USER_ACCOUNT (user_id, username, password) VALUES ('0ae8ae82-002b-4e3b-a3a0-555bd14cba22', 'user1', 'pass1234');
INSERT INTO USER_ACCOUNT (user_id, username, password) VALUES ('224482a6-13ee-476f-a9d5-1a13ee3ab459', 'user2', 'pass1234');
INSERT INTO USER_ACCOUNT (user_id, username, password) VALUES ('f3c13998-5cbc-4730-81bb-96138a2922cb', 'user3', 'pass1234');
INSERT INTO USER_ACCOUNT (user_id, username, password) VALUES ('6dbd521d-72f6-4b7c-a1fd-33d537f93c45', 'user4', 'pass1234');
INSERT INTO USER_ACCOUNT (user_id, username, password) VALUES ('bb213b9a-bc92-41c3-b83d-4956f232ffa6', 'user5', 'pass1234');
INSERT INTO USER_ACCOUNT (user_id, username, password) VALUES ('89208c15-c68f-4200-9444-efeb50e54f88', 'user6', 'pass1234');
INSERT INTO USER_ACCOUNT (user_id, username, password) VALUES ('da710e49-9b2b-4629-82e4-292548c8cb5a', 'user7', 'pass1234');
INSERT INTO USER_ACCOUNT (user_id, username, password) VALUES ('d5eba39e-0631-4bde-9670-fbf277762c2b', 'user8', 'pass1234');
INSERT INTO USER_ACCOUNT (user_id, username, password) VALUES ('e3118f89-7699-478d-8b30-67da595478c7', 'user9', 'pass1234');
INSERT INTO USER_ACCOUNT (user_id, username, password) VALUES ('1bc37d41-414a-4071-af7b-87a943050bf5', 'user10', 'pass1234');
INSERT INTO USER_ACCOUNT (user_id, username, password) VALUES ('0957e25e-1cd4-4272-8bef-4784edabcedf', 'user11', 'pass1234');
INSERT INTO USER_ACCOUNT (user_id, username, password) VALUES ('a52b03e5-d4c0-4989-a494-ad78614a014f', 'user12', 'pass1234');
INSERT INTO ROLE (role_id, role_name) VALUES ('42614cbf-3da1-4990-a866-3a86bdd2322f', 'administrator');
INSERT INTO ROLE (role_id, role_name) VALUES ('908e0d3e-609f-47cc-8365-4e098b0386a0', 'organizer');
INSERT INTO ROLE (role_id, role_name) VALUES ('8e97bfb0-05d5-4a6a-81fb-e7362182dfc8', 'customer');
INSERT INTO ACCOUNT_ROLE (role_id, user_id) VALUES ('8e97bfb0-05d5-4a6a-81fb-e7362182dfc8', '0ae8ae82-002b-4e3b-a3a0-555bd14cba22');
INSERT INTO ACCOUNT_ROLE (role_id, user_id) VALUES ('8e97bfb0-05d5-4a6a-81fb-e7362182dfc8', '224482a6-13ee-476f-a9d5-1a13ee3ab459');
INSERT INTO ACCOUNT_ROLE (role_id, user_id) VALUES ('8e97bfb0-05d5-4a6a-81fb-e7362182dfc8', 'f3c13998-5cbc-4730-81bb-96138a2922cb');
INSERT INTO ACCOUNT_ROLE (role_id, user_id) VALUES ('8e97bfb0-05d5-4a6a-81fb-e7362182dfc8', '6dbd521d-72f6-4b7c-a1fd-33d537f93c45');
INSERT INTO ACCOUNT_ROLE (role_id, user_id) VALUES ('8e97bfb0-05d5-4a6a-81fb-e7362182dfc8', 'bb213b9a-bc92-41c3-b83d-4956f232ffa6');
INSERT INTO ACCOUNT_ROLE (role_id, user_id) VALUES ('8e97bfb0-05d5-4a6a-81fb-e7362182dfc8', '89208c15-c68f-4200-9444-efeb50e54f88');
INSERT INTO ACCOUNT_ROLE (role_id, user_id) VALUES ('908e0d3e-609f-47cc-8365-4e098b0386a0', 'da710e49-9b2b-4629-82e4-292548c8cb5a');
INSERT INTO ACCOUNT_ROLE (role_id, user_id) VALUES ('908e0d3e-609f-47cc-8365-4e098b0386a0', 'd5eba39e-0631-4bde-9670-fbf277762c2b');
INSERT INTO ACCOUNT_ROLE (role_id, user_id) VALUES ('908e0d3e-609f-47cc-8365-4e098b0386a0', 'e3118f89-7699-478d-8b30-67da595478c7');
INSERT INTO ACCOUNT_ROLE (role_id, user_id) VALUES ('908e0d3e-609f-47cc-8365-4e098b0386a0', '1bc37d41-414a-4071-af7b-87a943050bf5');
INSERT INTO ACCOUNT_ROLE (role_id, user_id) VALUES ('42614cbf-3da1-4990-a866-3a86bdd2322f', '0957e25e-1cd4-4272-8bef-4784edabcedf');
INSERT INTO ACCOUNT_ROLE (role_id, user_id) VALUES ('42614cbf-3da1-4990-a866-3a86bdd2322f', 'a52b03e5-d4c0-4989-a494-ad78614a014f');
INSERT INTO ACCOUNT_ROLE (role_id, user_id) VALUES ('8e97bfb0-05d5-4a6a-81fb-e7362182dfc8', '0957e25e-1cd4-4272-8bef-4784edabcedf');
INSERT INTO ACCOUNT_ROLE (role_id, user_id) VALUES ('908e0d3e-609f-47cc-8365-4e098b0386a0', 'a52b03e5-d4c0-4989-a494-ad78614a014f');
INSERT INTO ACCOUNT_ROLE (role_id, user_id) VALUES ('42614cbf-3da1-4990-a866-3a86bdd2322f', '0ae8ae82-002b-4e3b-a3a0-555bd14cba22');
INSERT INTO CUSTOMER (customer_id, full_name, phone_number, user_id) VALUES ('781be8ae-f2fd-47f3-ac8d-78c92d3cad34', 'Customer Name 1', '08123456780', '0ae8ae82-002b-4e3b-a3a0-555bd14cba22');
INSERT INTO CUSTOMER (customer_id, full_name, phone_number, user_id) VALUES ('b0d15e50-33c6-4c06-b4d7-27776d203c8b', 'Customer Name 2', '08123456781', '224482a6-13ee-476f-a9d5-1a13ee3ab459');
INSERT INTO CUSTOMER (customer_id, full_name, phone_number, user_id) VALUES ('d661848a-1c3e-4e2f-aaea-a4984834bdd9', 'Customer Name 3', '08123456782', 'f3c13998-5cbc-4730-81bb-96138a2922cb');
INSERT INTO CUSTOMER (customer_id, full_name, phone_number, user_id) VALUES ('1c3ae63d-6e13-4dc9-ada5-5659d70d8aa2', 'Customer Name 4', '08123456783', '6dbd521d-72f6-4b7c-a1fd-33d537f93c45');
INSERT INTO CUSTOMER (customer_id, full_name, phone_number, user_id) VALUES ('96a5f6a6-3014-4597-a2c4-72b3ba8f62dc', 'Customer Name 5', '08123456784', 'bb213b9a-bc92-41c3-b83d-4956f232ffa6');
INSERT INTO CUSTOMER (customer_id, full_name, phone_number, user_id) VALUES ('5c53cecd-5593-4313-8258-46c93fb2d2d9', 'Customer Name 6', '08123456785', '89208c15-c68f-4200-9444-efeb50e54f88');
INSERT INTO ORGANIZER (organizer_id, organizer_name, contact_email, user_id) VALUES ('23195f63-79b0-45f4-95aa-631ddd43002c', 'Organizer Corp 1', 'org1@mail.com', 'da710e49-9b2b-4629-82e4-292548c8cb5a');
INSERT INTO ORGANIZER (organizer_id, organizer_name, contact_email, user_id) VALUES ('f1bbc0c7-8482-4845-b864-4f83c9cbab3c', 'Organizer Corp 2', 'org2@mail.com', 'd5eba39e-0631-4bde-9670-fbf277762c2b');
INSERT INTO ORGANIZER (organizer_id, organizer_name, contact_email, user_id) VALUES ('ac97e4ae-550d-4024-97f4-651358d06414', 'Organizer Corp 3', 'org3@mail.com', 'e3118f89-7699-478d-8b30-67da595478c7');
INSERT INTO ORGANIZER (organizer_id, organizer_name, contact_email, user_id) VALUES ('4b1fd87e-e5fc-457f-9e83-708a3f8f8191', 'Organizer Corp 4', 'org4@mail.com', '1bc37d41-414a-4071-af7b-87a943050bf5');
INSERT INTO VENUE (venue_id, venue_name, capacity, address, city) VALUES ('ea76f918-8762-4289-92f4-539072e18493', 'Venue Stadium 1', 50000, 'Jl. Raya Venue No. 1', 'Jakarta');
INSERT INTO VENUE (venue_id, venue_name, capacity, address, city) VALUES ('949c372d-5a66-43f1-8687-890eb2c5f2cf', 'Venue Stadium 2', 50000, 'Jl. Raya Venue No. 2', 'Jakarta');
INSERT INTO VENUE (venue_id, venue_name, capacity, address, city) VALUES ('1a4fd1c5-36de-48e3-9f48-5c23673a3b48', 'Venue Stadium 3', 50000, 'Jl. Raya Venue No. 3', 'Jakarta');
INSERT INTO VENUE (venue_id, venue_name, capacity, address, city) VALUES ('5b768d75-2169-410b-9f61-a7f21c180c66', 'Venue Stadium 4', 50000, 'Jl. Raya Venue No. 4', 'Jakarta');
INSERT INTO VENUE (venue_id, venue_name, capacity, address, city) VALUES ('962458bd-610e-44ea-947c-16602cb1d237', 'Venue Stadium 5', 50000, 'Jl. Raya Venue No. 5', 'Jakarta');
INSERT INTO SEAT (seat_id, section, seat_number, row_number, venue_id) VALUES ('321272c4-64b4-4642-9510-ad362d1e5176', 'VIP', '1', 'A', 'ea76f918-8762-4289-92f4-539072e18493');
INSERT INTO SEAT (seat_id, section, seat_number, row_number, venue_id) VALUES ('c0fb5df5-a42a-4d40-91e6-3b7f19acbcde', 'VIP', '2', 'A', 'ea76f918-8762-4289-92f4-539072e18493');
INSERT INTO SEAT (seat_id, section, seat_number, row_number, venue_id) VALUES ('9243238d-4a25-4a53-b8b9-f62ea2b6c751', 'VIP', '3', 'A', 'ea76f918-8762-4289-92f4-539072e18493');
INSERT INTO SEAT (seat_id, section, seat_number, row_number, venue_id) VALUES ('c31279f2-f269-47dd-aaaf-3877b5562754', 'VIP', '4', 'A', 'ea76f918-8762-4289-92f4-539072e18493');
INSERT INTO SEAT (seat_id, section, seat_number, row_number, venue_id) VALUES ('345e4011-6754-462f-9ee7-3bd317a5fbba', 'VIP', '5', 'A', 'ea76f918-8762-4289-92f4-539072e18493');
INSERT INTO SEAT (seat_id, section, seat_number, row_number, venue_id) VALUES ('74aaaf3d-b310-4144-b3ff-c446a3641f37', 'VIP', '6', 'A', 'ea76f918-8762-4289-92f4-539072e18493');
INSERT INTO SEAT (seat_id, section, seat_number, row_number, venue_id) VALUES ('18e6c35d-00d4-4397-8ed0-01bf08e89a93', 'VIP', '1', 'A', '949c372d-5a66-43f1-8687-890eb2c5f2cf');
INSERT INTO SEAT (seat_id, section, seat_number, row_number, venue_id) VALUES ('df10c88a-c193-4d0d-8b07-167e16907486', 'VIP', '2', 'A', '949c372d-5a66-43f1-8687-890eb2c5f2cf');
INSERT INTO SEAT (seat_id, section, seat_number, row_number, venue_id) VALUES ('76451575-2039-425d-a865-326db5636c76', 'VIP', '3', 'A', '949c372d-5a66-43f1-8687-890eb2c5f2cf');
INSERT INTO SEAT (seat_id, section, seat_number, row_number, venue_id) VALUES ('adbab232-75f5-4aaf-bca5-24e5595cacc4', 'VIP', '4', 'A', '949c372d-5a66-43f1-8687-890eb2c5f2cf');
INSERT INTO SEAT (seat_id, section, seat_number, row_number, venue_id) VALUES ('7ddf3d09-0554-41df-a250-17ebd3055e9a', 'VIP', '5', 'A', '949c372d-5a66-43f1-8687-890eb2c5f2cf');
INSERT INTO SEAT (seat_id, section, seat_number, row_number, venue_id) VALUES ('a9b60b2d-3c10-49ca-b7cc-7c11a3bcf96f', 'VIP', '6', 'A', '949c372d-5a66-43f1-8687-890eb2c5f2cf');
INSERT INTO SEAT (seat_id, section, seat_number, row_number, venue_id) VALUES ('add98a18-7533-488e-9342-e0ef4ce87e6d', 'VIP', '1', 'A', '1a4fd1c5-36de-48e3-9f48-5c23673a3b48');
INSERT INTO SEAT (seat_id, section, seat_number, row_number, venue_id) VALUES ('c6fd7db0-6b0e-46c7-aebe-239a54d36a30', 'VIP', '2', 'A', '1a4fd1c5-36de-48e3-9f48-5c23673a3b48');
INSERT INTO SEAT (seat_id, section, seat_number, row_number, venue_id) VALUES ('55bcc4a0-ddee-41f4-adb5-4a5fa350406c', 'VIP', '3', 'A', '1a4fd1c5-36de-48e3-9f48-5c23673a3b48');
INSERT INTO SEAT (seat_id, section, seat_number, row_number, venue_id) VALUES ('97a84ead-ac7a-4a55-93c7-52dc982410b9', 'VIP', '4', 'A', '1a4fd1c5-36de-48e3-9f48-5c23673a3b48');
INSERT INTO SEAT (seat_id, section, seat_number, row_number, venue_id) VALUES ('b054f0c5-2f78-45c0-9113-45582471dbe5', 'VIP', '5', 'A', '1a4fd1c5-36de-48e3-9f48-5c23673a3b48');
INSERT INTO SEAT (seat_id, section, seat_number, row_number, venue_id) VALUES ('f43531f1-eb12-42cd-8f77-481efd2dcbfe', 'VIP', '6', 'A', '1a4fd1c5-36de-48e3-9f48-5c23673a3b48');
INSERT INTO SEAT (seat_id, section, seat_number, row_number, venue_id) VALUES ('334a4d6c-81e9-4417-abb2-2aa35c09323b', 'VIP', '1', 'A', '5b768d75-2169-410b-9f61-a7f21c180c66');
INSERT INTO SEAT (seat_id, section, seat_number, row_number, venue_id) VALUES ('05a15c06-1f25-4453-901d-52592e60cc86', 'VIP', '2', 'A', '5b768d75-2169-410b-9f61-a7f21c180c66');
INSERT INTO SEAT (seat_id, section, seat_number, row_number, venue_id) VALUES ('ed584ca1-b5a6-4b67-bbf0-ef31392d92a1', 'VIP', '3', 'A', '5b768d75-2169-410b-9f61-a7f21c180c66');
INSERT INTO SEAT (seat_id, section, seat_number, row_number, venue_id) VALUES ('f6c7acd9-fa77-401c-b516-b5419f71fc91', 'VIP', '4', 'A', '5b768d75-2169-410b-9f61-a7f21c180c66');
INSERT INTO SEAT (seat_id, section, seat_number, row_number, venue_id) VALUES ('81254624-fcbb-4bb0-be16-4bbc948dc286', 'VIP', '5', 'A', '5b768d75-2169-410b-9f61-a7f21c180c66');
INSERT INTO SEAT (seat_id, section, seat_number, row_number, venue_id) VALUES ('a5d555e3-bec1-48bf-a448-5ecc214e740f', 'VIP', '6', 'A', '5b768d75-2169-410b-9f61-a7f21c180c66');
INSERT INTO SEAT (seat_id, section, seat_number, row_number, venue_id) VALUES ('ad62ff1b-2a47-493f-bf64-fc5db4b39991', 'VIP', '1', 'A', '962458bd-610e-44ea-947c-16602cb1d237');
INSERT INTO SEAT (seat_id, section, seat_number, row_number, venue_id) VALUES ('13175b71-9dbb-44d8-83ef-fdc83138cee7', 'VIP', '2', 'A', '962458bd-610e-44ea-947c-16602cb1d237');
INSERT INTO SEAT (seat_id, section, seat_number, row_number, venue_id) VALUES ('da3b36f2-ec16-400a-bcd7-56bb340dae67', 'VIP', '3', 'A', '962458bd-610e-44ea-947c-16602cb1d237');
INSERT INTO SEAT (seat_id, section, seat_number, row_number, venue_id) VALUES ('08f89465-f237-4d5d-9976-71ce9c2e3048', 'VIP', '4', 'A', '962458bd-610e-44ea-947c-16602cb1d237');
INSERT INTO SEAT (seat_id, section, seat_number, row_number, venue_id) VALUES ('084a1e01-fd69-41ab-a96b-ef5101d314fd', 'VIP', '5', 'A', '962458bd-610e-44ea-947c-16602cb1d237');
INSERT INTO SEAT (seat_id, section, seat_number, row_number, venue_id) VALUES ('bbf17797-7145-4ad4-8a5f-8ecb4108377e', 'VIP', '6', 'A', '962458bd-610e-44ea-947c-16602cb1d237');
INSERT INTO ARTIST (artist_id, name, genre) VALUES ('b7e50541-3dec-4d3c-9188-a50c415c855b', 'Artist Band 1', 'Pop');
INSERT INTO ARTIST (artist_id, name, genre) VALUES ('7fa4aab0-d91f-4cbf-b9b3-cec34435fa8f', 'Artist Band 2', 'Pop');
INSERT INTO ARTIST (artist_id, name, genre) VALUES ('0dfa018a-e10c-49d0-898c-e7a9e5e39c9c', 'Artist Band 3', 'Pop');
INSERT INTO ARTIST (artist_id, name, genre) VALUES ('029b8b3c-e625-463c-815a-e64b7e244de8', 'Artist Band 4', 'Pop');
INSERT INTO ARTIST (artist_id, name, genre) VALUES ('50fea217-874d-4f36-955c-1126b478d911', 'Artist Band 5', 'Pop');
INSERT INTO ARTIST (artist_id, name, genre) VALUES ('6593acc9-7329-4fb4-9446-4017be6411f0', 'Artist Band 6', 'Pop');
INSERT INTO ARTIST (artist_id, name, genre) VALUES ('3fab1ad3-5a71-4035-bb38-1c372a575eee', 'Artist Band 7', 'Pop');
INSERT INTO ARTIST (artist_id, name, genre) VALUES ('78a0659f-8b46-4f31-be7c-3c61a1187162', 'Artist Band 8', 'Pop');
INSERT INTO EVENT (event_id, event_datetime, event_title, venue_id, organizer_id) VALUES ('b3a95440-b348-42b7-923b-3b052c247a6b', '2026-05-29 22:16:59', 'Konser Spektakuler 1', 'ea76f918-8762-4289-92f4-539072e18493', '23195f63-79b0-45f4-95aa-631ddd43002c');
INSERT INTO EVENT (event_id, event_datetime, event_title, venue_id, organizer_id) VALUES ('84ff9962-8ef4-4b7a-b131-a507b9c94c6d', '2026-05-30 22:16:59', 'Konser Spektakuler 2', '949c372d-5a66-43f1-8687-890eb2c5f2cf', 'f1bbc0c7-8482-4845-b864-4f83c9cbab3c');
INSERT INTO EVENT (event_id, event_datetime, event_title, venue_id, organizer_id) VALUES ('92a2c12c-1328-4e58-92fd-5faa61fd5d37', '2026-05-31 22:16:59', 'Konser Spektakuler 3', '1a4fd1c5-36de-48e3-9f48-5c23673a3b48', 'ac97e4ae-550d-4024-97f4-651358d06414');
INSERT INTO EVENT (event_id, event_datetime, event_title, venue_id, organizer_id) VALUES ('f1ce4ab2-c943-4367-80bd-05b5c016d8f9', '2026-06-01 22:16:59', 'Konser Spektakuler 4', '5b768d75-2169-410b-9f61-a7f21c180c66', '4b1fd87e-e5fc-457f-9e83-708a3f8f8191');
INSERT INTO EVENT (event_id, event_datetime, event_title, venue_id, organizer_id) VALUES ('f6f2a40e-10df-4c46-a113-0a32ad0156c9', '2026-06-02 22:16:59', 'Konser Spektakuler 5', '962458bd-610e-44ea-947c-16602cb1d237', '23195f63-79b0-45f4-95aa-631ddd43002c');
INSERT INTO EVENT (event_id, event_datetime, event_title, venue_id, organizer_id) VALUES ('ff478d9b-852f-4763-a4c2-26d28b36609f', '2026-06-03 22:16:59', 'Konser Spektakuler 6', 'ea76f918-8762-4289-92f4-539072e18493', 'f1bbc0c7-8482-4845-b864-4f83c9cbab3c');
INSERT INTO EVENT_ARTIST (event_id, artist_id, role) VALUES ('b3a95440-b348-42b7-923b-3b052c247a6b', 'b7e50541-3dec-4d3c-9188-a50c415c855b', 'Main Performer');
INSERT INTO EVENT_ARTIST (event_id, artist_id, role) VALUES ('b3a95440-b348-42b7-923b-3b052c247a6b', '7fa4aab0-d91f-4cbf-b9b3-cec34435fa8f', 'Main Performer');
INSERT INTO EVENT_ARTIST (event_id, artist_id, role) VALUES ('84ff9962-8ef4-4b7a-b131-a507b9c94c6d', '0dfa018a-e10c-49d0-898c-e7a9e5e39c9c', 'Main Performer');
INSERT INTO EVENT_ARTIST (event_id, artist_id, role) VALUES ('84ff9962-8ef4-4b7a-b131-a507b9c94c6d', '029b8b3c-e625-463c-815a-e64b7e244de8', 'Main Performer');
INSERT INTO EVENT_ARTIST (event_id, artist_id, role) VALUES ('92a2c12c-1328-4e58-92fd-5faa61fd5d37', '50fea217-874d-4f36-955c-1126b478d911', 'Main Performer');
INSERT INTO EVENT_ARTIST (event_id, artist_id, role) VALUES ('92a2c12c-1328-4e58-92fd-5faa61fd5d37', '6593acc9-7329-4fb4-9446-4017be6411f0', 'Main Performer');
INSERT INTO EVENT_ARTIST (event_id, artist_id, role) VALUES ('f1ce4ab2-c943-4367-80bd-05b5c016d8f9', '3fab1ad3-5a71-4035-bb38-1c372a575eee', 'Main Performer');
INSERT INTO EVENT_ARTIST (event_id, artist_id, role) VALUES ('f1ce4ab2-c943-4367-80bd-05b5c016d8f9', '78a0659f-8b46-4f31-be7c-3c61a1187162', 'Main Performer');
INSERT INTO EVENT_ARTIST (event_id, artist_id, role) VALUES ('f6f2a40e-10df-4c46-a113-0a32ad0156c9', 'b7e50541-3dec-4d3c-9188-a50c415c855b', 'Main Performer');
INSERT INTO EVENT_ARTIST (event_id, artist_id, role) VALUES ('f6f2a40e-10df-4c46-a113-0a32ad0156c9', '7fa4aab0-d91f-4cbf-b9b3-cec34435fa8f', 'Main Performer');
INSERT INTO EVENT_ARTIST (event_id, artist_id, role) VALUES ('ff478d9b-852f-4763-a4c2-26d28b36609f', '0dfa018a-e10c-49d0-898c-e7a9e5e39c9c', 'Main Performer');
INSERT INTO EVENT_ARTIST (event_id, artist_id, role) VALUES ('ff478d9b-852f-4763-a4c2-26d28b36609f', '029b8b3c-e625-463c-815a-e64b7e244de8', 'Main Performer');
INSERT INTO TICKET_CATEGORY (category_id, category_name, quota, price, tevent_id) VALUES ('9f20b80b-e379-4f70-9700-c8aedaf52507', 'Category 1', 1000, 500000.00, 'b3a95440-b348-42b7-923b-3b052c247a6b');
INSERT INTO TICKET_CATEGORY (category_id, category_name, quota, price, tevent_id) VALUES ('4577d587-ed86-4d36-a4e1-88736a9e1e09', 'Category 2', 1000, 500000.00, '84ff9962-8ef4-4b7a-b131-a507b9c94c6d');
INSERT INTO TICKET_CATEGORY (category_id, category_name, quota, price, tevent_id) VALUES ('4ab59692-6872-4bb1-9ef7-6801db08596c', 'Category 3', 1000, 500000.00, '92a2c12c-1328-4e58-92fd-5faa61fd5d37');
INSERT INTO TICKET_CATEGORY (category_id, category_name, quota, price, tevent_id) VALUES ('a4ef5304-161c-49c9-b32c-b6952d3df6a0', 'Category 4', 1000, 500000.00, 'f1ce4ab2-c943-4367-80bd-05b5c016d8f9');
INSERT INTO TICKET_CATEGORY (category_id, category_name, quota, price, tevent_id) VALUES ('6eab81a4-685b-45a2-b84f-a0492005509d', 'Category 5', 1000, 500000.00, 'f6f2a40e-10df-4c46-a113-0a32ad0156c9');
INSERT INTO TICKET_CATEGORY (category_id, category_name, quota, price, tevent_id) VALUES ('50bfb97b-1693-439e-8507-c9f5583f8b09', 'Category 6', 1000, 500000.00, 'ff478d9b-852f-4763-a4c2-26d28b36609f');
INSERT INTO TICKET_CATEGORY (category_id, category_name, quota, price, tevent_id) VALUES ('2cbaba2d-0a82-43f7-aa8a-0cb3dd3396ea', 'Category 7', 1000, 500000.00, 'b3a95440-b348-42b7-923b-3b052c247a6b');
INSERT INTO TICKET_CATEGORY (category_id, category_name, quota, price, tevent_id) VALUES ('5c6e9fd9-afd3-4e13-963e-1fbff621043a', 'Category 8', 1000, 500000.00, '84ff9962-8ef4-4b7a-b131-a507b9c94c6d');
INSERT INTO TICKET_CATEGORY (category_id, category_name, quota, price, tevent_id) VALUES ('6aa379e4-29aa-47fe-a5fe-35ef17899025', 'Category 9', 1000, 500000.00, '92a2c12c-1328-4e58-92fd-5faa61fd5d37');
INSERT INTO TICKET_CATEGORY (category_id, category_name, quota, price, tevent_id) VALUES ('3895e94d-d729-4841-bfd3-62220ccfcce8', 'Category 10', 1000, 500000.00, 'f1ce4ab2-c943-4367-80bd-05b5c016d8f9');
INSERT INTO TICKET_CATEGORY (category_id, category_name, quota, price, tevent_id) VALUES ('2a257dde-1e7d-4165-8c28-e4198b762470', 'Category 11', 1000, 500000.00, 'f6f2a40e-10df-4c46-a113-0a32ad0156c9');
INSERT INTO TICKET_CATEGORY (category_id, category_name, quota, price, tevent_id) VALUES ('cbd44b90-3d66-42b9-b3f8-c8770d501401', 'Category 12', 1000, 500000.00, 'ff478d9b-852f-4763-a4c2-26d28b36609f');
INSERT INTO TICKET_CATEGORY (category_id, category_name, quota, price, tevent_id) VALUES ('610a8239-5468-4c78-a1ce-de6931ba3223', 'Category 13', 1000, 500000.00, 'b3a95440-b348-42b7-923b-3b052c247a6b');
INSERT INTO TICKET_CATEGORY (category_id, category_name, quota, price, tevent_id) VALUES ('4013c292-54b1-4bfc-bee5-3bbae144a3b4', 'Category 14', 1000, 500000.00, '84ff9962-8ef4-4b7a-b131-a507b9c94c6d');
INSERT INTO PROMOTION (promotion_id, promo_code, discount_type, discount_value, start_date, end_date, usage_limit) VALUES ('3d194dce-721f-4be0-bffc-5ff29459e587', 'PROMO2024_0', 'PERCENTAGE', 10.00, '2026-04-29', '2026-06-28', 100);
INSERT INTO PROMOTION (promotion_id, promo_code, discount_type, discount_value, start_date, end_date, usage_limit) VALUES ('f9664f87-9c1a-4203-b710-0cd27af86191', 'PROMO2024_1', 'PERCENTAGE', 10.00, '2026-04-29', '2026-06-28', 100);
INSERT INTO PROMOTION (promotion_id, promo_code, discount_type, discount_value, start_date, end_date, usage_limit) VALUES ('a7712c51-6870-47ee-b179-ff48461dfe5e', 'PROMO2024_2', 'PERCENTAGE', 10.00, '2026-04-29', '2026-06-28', 100);
INSERT INTO PROMOTION (promotion_id, promo_code, discount_type, discount_value, start_date, end_date, usage_limit) VALUES ('ad38fa50-569a-427a-be32-a4398e3ae3fc', 'PROMO2024_3', 'PERCENTAGE', 10.00, '2026-04-29', '2026-06-28', 100);
INSERT INTO PROMOTION (promotion_id, promo_code, discount_type, discount_value, start_date, end_date, usage_limit) VALUES ('9e52d942-0b10-461c-9ae6-ae152215ca69', 'PROMO2024_4', 'PERCENTAGE', 10.00, '2026-04-29', '2026-06-28', 100);
INSERT INTO PROMOTION (promotion_id, promo_code, discount_type, discount_value, start_date, end_date, usage_limit) VALUES ('67cbbdb0-53ac-443e-9d46-3bad8f87350e', 'PROMO2024_5', 'PERCENTAGE', 10.00, '2026-04-29', '2026-06-28', 100);
INSERT INTO orders (order_id, order_date, payment_status, total_amount, customer_id) VALUES ('95e98084-7d90-45a2-960f-72a1e8b44a54', '2026-04-29 22:16:59', 'PAID', 1500000.00, '781be8ae-f2fd-47f3-ac8d-78c92d3cad34');
INSERT INTO orders (order_id, order_date, payment_status, total_amount, customer_id) VALUES ('ee681f4c-d1d1-4c71-aab1-28138f41eff8', '2026-04-29 22:16:59', 'PAID', 1500000.00, 'b0d15e50-33c6-4c06-b4d7-27776d203c8b');
INSERT INTO orders (order_id, order_date, payment_status, total_amount, customer_id) VALUES ('463b8544-9730-4fc8-910a-7dc65338e69a', '2026-04-29 22:16:59', 'PAID', 1500000.00, 'd661848a-1c3e-4e2f-aaea-a4984834bdd9');
INSERT INTO orders (order_id, order_date, payment_status, total_amount, customer_id) VALUES ('6fdaed56-afd1-4370-b84e-bd480c63674b', '2026-04-29 22:16:59', 'PAID', 1500000.00, '1c3ae63d-6e13-4dc9-ada5-5659d70d8aa2');
INSERT INTO orders (order_id, order_date, payment_status, total_amount, customer_id) VALUES ('0a2ede8e-9a77-4f8c-90a5-c9cf75fb1165', '2026-04-29 22:16:59', 'PAID', 1500000.00, '96a5f6a6-3014-4597-a2c4-72b3ba8f62dc');
INSERT INTO orders (order_id, order_date, payment_status, total_amount, customer_id) VALUES ('0c02e5b2-ded5-48e7-8ad1-5521fd937f2d', '2026-04-29 22:16:59', 'PAID', 1500000.00, '5c53cecd-5593-4313-8258-46c93fb2d2d9');
INSERT INTO orders (order_id, order_date, payment_status, total_amount, customer_id) VALUES ('a74d61dc-680a-4893-8cf0-b0102a784a09', '2026-04-29 22:16:59', 'PAID', 1500000.00, '781be8ae-f2fd-47f3-ac8d-78c92d3cad34');
INSERT INTO orders (order_id, order_date, payment_status, total_amount, customer_id) VALUES ('c987e180-8abd-40d9-93ff-56d804a8ba36', '2026-04-29 22:16:59', 'PAID', 1500000.00, 'b0d15e50-33c6-4c06-b4d7-27776d203c8b');
INSERT INTO orders (order_id, order_date, payment_status, total_amount, customer_id) VALUES ('f09414c1-ade4-4f8a-a383-c75fd4fcd2a6', '2026-04-29 22:16:59', 'PAID', 1500000.00, 'd661848a-1c3e-4e2f-aaea-a4984834bdd9');
INSERT INTO orders (order_id, order_date, payment_status, total_amount, customer_id) VALUES ('63e137c3-a69c-4676-bfb2-84dc7835e107', '2026-04-29 22:16:59', 'PAID', 1500000.00, '1c3ae63d-6e13-4dc9-ada5-5659d70d8aa2');
INSERT INTO orders (order_id, order_date, payment_status, total_amount, customer_id) VALUES ('1cc5bb75-f24c-483b-abcf-16f5ca955bf1', '2026-04-29 22:16:59', 'PAID', 1500000.00, '96a5f6a6-3014-4597-a2c4-72b3ba8f62dc');
INSERT INTO orders (order_id, order_date, payment_status, total_amount, customer_id) VALUES ('378f48c2-764c-40d9-8692-51b8a80adcfa', '2026-04-29 22:16:59', 'PAID', 1500000.00, '5c53cecd-5593-4313-8258-46c93fb2d2d9');
INSERT INTO ORDER_PROMOTION (order_promotion_id, promotion_id, order_id) VALUES ('00a749bf-87f0-4e40-b07d-ec982a417469', '3d194dce-721f-4be0-bffc-5ff29459e587', '95e98084-7d90-45a2-960f-72a1e8b44a54');
INSERT INTO ORDER_PROMOTION (order_promotion_id, promotion_id, order_id) VALUES ('c6cdab01-49fe-49a4-964c-cd207d7d9441', 'f9664f87-9c1a-4203-b710-0cd27af86191', 'ee681f4c-d1d1-4c71-aab1-28138f41eff8');
INSERT INTO ORDER_PROMOTION (order_promotion_id, promotion_id, order_id) VALUES ('9d06168a-bb83-43dc-8cb1-b01a2466e726', 'a7712c51-6870-47ee-b179-ff48461dfe5e', '463b8544-9730-4fc8-910a-7dc65338e69a');
INSERT INTO ORDER_PROMOTION (order_promotion_id, promotion_id, order_id) VALUES ('d57bf9ee-f862-4ddb-97f2-d26a02303091', 'ad38fa50-569a-427a-be32-a4398e3ae3fc', '6fdaed56-afd1-4370-b84e-bd480c63674b');
INSERT INTO ORDER_PROMOTION (order_promotion_id, promotion_id, order_id) VALUES ('548333f1-15eb-450a-8adf-0e6dc7f5a3de', '9e52d942-0b10-461c-9ae6-ae152215ca69', '0a2ede8e-9a77-4f8c-90a5-c9cf75fb1165');
INSERT INTO TICKET (ticket_id, ticket_code, tcategory_id, torder_id) VALUES ('fc4f1c10-3cd5-4d53-983e-b8aff2ef7102', 'TIX-1000', '9f20b80b-e379-4f70-9700-c8aedaf52507', '95e98084-7d90-45a2-960f-72a1e8b44a54');
INSERT INTO TICKET (ticket_id, ticket_code, tcategory_id, torder_id) VALUES ('f1e4e633-f0b3-449b-8cb0-441dca96a34b', 'TIX-1001', '4577d587-ed86-4d36-a4e1-88736a9e1e09', 'ee681f4c-d1d1-4c71-aab1-28138f41eff8');
INSERT INTO TICKET (ticket_id, ticket_code, tcategory_id, torder_id) VALUES ('5152624c-72a3-4fcc-809f-b51af8a89adb', 'TIX-1002', '4ab59692-6872-4bb1-9ef7-6801db08596c', '463b8544-9730-4fc8-910a-7dc65338e69a');
INSERT INTO TICKET (ticket_id, ticket_code, tcategory_id, torder_id) VALUES ('39e76660-26c8-4f5a-86e9-c0fd5e28abb5', 'TIX-1003', 'a4ef5304-161c-49c9-b32c-b6952d3df6a0', '6fdaed56-afd1-4370-b84e-bd480c63674b');
INSERT INTO TICKET (ticket_id, ticket_code, tcategory_id, torder_id) VALUES ('9309ce7f-ecba-4680-b419-a9f53c7e533a', 'TIX-1004', '6eab81a4-685b-45a2-b84f-a0492005509d', '0a2ede8e-9a77-4f8c-90a5-c9cf75fb1165');
INSERT INTO TICKET (ticket_id, ticket_code, tcategory_id, torder_id) VALUES ('23a08455-13c0-42e8-ae58-808f64245dee', 'TIX-1005', '50bfb97b-1693-439e-8507-c9f5583f8b09', '0c02e5b2-ded5-48e7-8ad1-5521fd937f2d');
INSERT INTO TICKET (ticket_id, ticket_code, tcategory_id, torder_id) VALUES ('e056e972-12ee-4d9e-93ac-9bcfcd2db3af', 'TIX-1006', '2cbaba2d-0a82-43f7-aa8a-0cb3dd3396ea', 'a74d61dc-680a-4893-8cf0-b0102a784a09');
INSERT INTO TICKET (ticket_id, ticket_code, tcategory_id, torder_id) VALUES ('1546a73d-0392-438f-a69b-e9a988c2ff26', 'TIX-1007', '5c6e9fd9-afd3-4e13-963e-1fbff621043a', 'c987e180-8abd-40d9-93ff-56d804a8ba36');
INSERT INTO TICKET (ticket_id, ticket_code, tcategory_id, torder_id) VALUES ('dcf53264-4c45-4725-9ab9-3ab6ac723700', 'TIX-1008', '6aa379e4-29aa-47fe-a5fe-35ef17899025', 'f09414c1-ade4-4f8a-a383-c75fd4fcd2a6');
INSERT INTO TICKET (ticket_id, ticket_code, tcategory_id, torder_id) VALUES ('db94fca4-1af1-44ba-bf26-d91ef7b1cfa5', 'TIX-1009', '3895e94d-d729-4841-bfd3-62220ccfcce8', '63e137c3-a69c-4676-bfb2-84dc7835e107');
INSERT INTO TICKET (ticket_id, ticket_code, tcategory_id, torder_id) VALUES ('23b24be7-b3ac-452a-809f-d924167ecfc7', 'TIX-1010', '2a257dde-1e7d-4165-8c28-e4198b762470', '1cc5bb75-f24c-483b-abcf-16f5ca955bf1');
INSERT INTO TICKET (ticket_id, ticket_code, tcategory_id, torder_id) VALUES ('0b358a4f-6b2a-48e4-bb29-84bce056dc14', 'TIX-1011', 'cbd44b90-3d66-42b9-b3f8-c8770d501401', '378f48c2-764c-40d9-8692-51b8a80adcfa');
INSERT INTO TICKET (ticket_id, ticket_code, tcategory_id, torder_id) VALUES ('733ea325-34b2-416d-8042-cc4db3911ca5', 'TIX-1012', '610a8239-5468-4c78-a1ce-de6931ba3223', '95e98084-7d90-45a2-960f-72a1e8b44a54');
INSERT INTO TICKET (ticket_id, ticket_code, tcategory_id, torder_id) VALUES ('27391871-6864-4902-9faa-3bdd39311de5', 'TIX-1013', '4013c292-54b1-4bfc-bee5-3bbae144a3b4', 'ee681f4c-d1d1-4c71-aab1-28138f41eff8');
INSERT INTO TICKET (ticket_id, ticket_code, tcategory_id, torder_id) VALUES ('39a41ce9-dd33-44ee-b919-641369486eb8', 'TIX-1014', '9f20b80b-e379-4f70-9700-c8aedaf52507', '463b8544-9730-4fc8-910a-7dc65338e69a');
INSERT INTO TICKET (ticket_id, ticket_code, tcategory_id, torder_id) VALUES ('4fada9a1-abd6-40ee-bdd2-c0746066381d', 'TIX-1015', '4577d587-ed86-4d36-a4e1-88736a9e1e09', '6fdaed56-afd1-4370-b84e-bd480c63674b');
INSERT INTO TICKET (ticket_id, ticket_code, tcategory_id, torder_id) VALUES ('a68bdcfb-642c-462a-b927-ca74c9fd9801', 'TIX-1016', '4ab59692-6872-4bb1-9ef7-6801db08596c', '0a2ede8e-9a77-4f8c-90a5-c9cf75fb1165');
INSERT INTO TICKET (ticket_id, ticket_code, tcategory_id, torder_id) VALUES ('d673aff1-35bf-466a-a591-2e38e4c39de1', 'TIX-1017', 'a4ef5304-161c-49c9-b32c-b6952d3df6a0', '0c02e5b2-ded5-48e7-8ad1-5521fd937f2d');
INSERT INTO TICKET (ticket_id, ticket_code, tcategory_id, torder_id) VALUES ('0db74986-0b9e-47ea-a03c-fa8a5dc62fa5', 'TIX-1018', '6eab81a4-685b-45a2-b84f-a0492005509d', 'a74d61dc-680a-4893-8cf0-b0102a784a09');
INSERT INTO TICKET (ticket_id, ticket_code, tcategory_id, torder_id) VALUES ('7a4193e4-de1c-41ba-b3d1-4d1a45834ae3', 'TIX-1019', '50bfb97b-1693-439e-8507-c9f5583f8b09', 'c987e180-8abd-40d9-93ff-56d804a8ba36');
INSERT INTO HAS_RELATIONSHIP (seat_id, ticket_id) VALUES ('321272c4-64b4-4642-9510-ad362d1e5176', 'fc4f1c10-3cd5-4d53-983e-b8aff2ef7102');
INSERT INTO HAS_RELATIONSHIP (seat_id, ticket_id) VALUES ('c0fb5df5-a42a-4d40-91e6-3b7f19acbcde', 'f1e4e633-f0b3-449b-8cb0-441dca96a34b');
INSERT INTO HAS_RELATIONSHIP (seat_id, ticket_id) VALUES ('9243238d-4a25-4a53-b8b9-f62ea2b6c751', '5152624c-72a3-4fcc-809f-b51af8a89adb');
INSERT INTO HAS_RELATIONSHIP (seat_id, ticket_id) VALUES ('c31279f2-f269-47dd-aaaf-3877b5562754', '39e76660-26c8-4f5a-86e9-c0fd5e28abb5');
INSERT INTO HAS_RELATIONSHIP (seat_id, ticket_id) VALUES ('345e4011-6754-462f-9ee7-3bd317a5fbba', '9309ce7f-ecba-4680-b419-a9f53c7e533a');
INSERT INTO HAS_RELATIONSHIP (seat_id, ticket_id) VALUES ('74aaaf3d-b310-4144-b3ff-c446a3641f37', '23a08455-13c0-42e8-ae58-808f64245dee');
INSERT INTO HAS_RELATIONSHIP (seat_id, ticket_id) VALUES ('18e6c35d-00d4-4397-8ed0-01bf08e89a93', 'e056e972-12ee-4d9e-93ac-9bcfcd2db3af');
INSERT INTO HAS_RELATIONSHIP (seat_id, ticket_id) VALUES ('df10c88a-c193-4d0d-8b07-167e16907486', '1546a73d-0392-438f-a69b-e9a988c2ff26');
INSERT INTO HAS_RELATIONSHIP (seat_id, ticket_id) VALUES ('76451575-2039-425d-a865-326db5636c76', 'dcf53264-4c45-4725-9ab9-3ab6ac723700');
INSERT INTO HAS_RELATIONSHIP (seat_id, ticket_id) VALUES ('adbab232-75f5-4aaf-bca5-24e5595cacc4', 'db94fca4-1af1-44ba-bf26-d91ef7b1cfa5');