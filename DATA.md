
# Data Management

## Menu Data

Menu-related data is accessed through the existing utilities
in `lib/dishes`.

## Order Data

Order creation is handled by the API route:

`app/api/orders/route.js`

The route checks the user's session and role, validates the
delivery neighbourhood, retrieves dish details from the server,
and validates quantities before creating an order.

Order creation is delegated to `createOrderForUser` in
`lib/orders.js`.

## Data Validation

- Validate request bodies on the server.
- Use server-side dish prices rather than browser-submitted prices.
- Require a valid delivery neighbourhood.
- Require quantities to be integers between 1 and 50.
- Return appropriate HTTP status codes for invalid requests.

## Storage

Check `lib/orders.js` to confirm how orders are stored.
Document whether storage is in memory, in a file, or in a database.
Do not describe orders as permanently stored unless the implementation
actually provides persistent storage.

## Maintenance

Update this document whenever the data source, order structure,
validation rules, or storage method changes.