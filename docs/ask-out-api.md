# Ask-Out API

Base URL: `/api/ask-outs`

## Data Shape

```json
{
  "_id": "string",
  "question": "string (required)",
  "gifUrl": "string",
  "yesLabel": "string",
  "noLabel": "string",
  "yesTitle": "string",
  "yesSubtext": "string",
  "yesImageUrl": "string"
}
```

## Endpoints

| Method | Path               | Auth | Description         |
|--------|--------------------|------|---------------------|
| GET    | `/api/ask-outs`    | none | Get all ask-outs    |
| GET    | `/api/ask-outs/:id`| none | Get one by ID       |
| POST   | `/api/ask-outs`    | none | Create new ask-out  |
| PUT    | `/api/ask-outs/:id`| none | Update ask-out      |
| DELETE | `/api/ask-outs/:id`| none | Delete ask-out      |

No authentication required.

## Example

**GET /api/ask-outs** — returns array of ask-out objects.

**POST /api/ask-outs**
```json
{
  "question": "Are you gay, Dima?",
  "gifUrl": "http://media.tenor.com/f6rDUpYoT5gAAAAj/peeposhy-pepeshy.gif",
  "yesLabel": "YES 💖",
  "noLabel": "NO 😭",
  "yesTitle": "Of course",
  "yesSubtext": "Я же, блять, так и знал!",
  "yesImageUrl": "https://example.com/image.jpg"
}
```
Returns the created object with `_id`.

**PUT /api/ask-outs/:id** — same body as POST, returns updated object.
