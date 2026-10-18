# Authentication and Authorization

## Overview

Addis Eats uses session-based authentication through the
existing authentication utilities in `lib/session`.

## User Roles

- Customer: can browse the menu, manage a cart, and place orders.
- Admin: can access authorized administrative features.


## Order Access Rules

- Customers must sign in before placing an order.
- The order API rejects unauthenticated requests with HTTP 401.
- The order API rejects non-customer accounts with HTTP 403.
- The server validates the selected delivery neighbourhood.
- The server validates dish IDs and quantities before creating an order.

## Security Requirements

- Enforce permissions on the server, not only in the interface.
- Do not expose session secrets or credentials in client-side code.
- Do not commit private environment variables.
- Keep authentication errors clear without exposing sensitive details.

## Maintenance

When authentication, session handling, or role permissions change,
update this document to match the implementation.