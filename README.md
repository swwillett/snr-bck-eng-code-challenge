# Overpass Code Challenge Solution

This is a NestJS application that integrates with the Overpass API to fetch and store nearby landmarks. It includes features like:

- Protected webhook endpoint for receiving coordinates.
- Integration with the Overpass API to fetch nearby landmarks.
- Storage of landmarks in a SQLite database.
- Caching of landmarks for faster retrieval.
- Error handling for invalid inputs, missing environment variables, and external API failures.
- End-to-end (e2e) testing for all endpoints.

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/swwillett/snr-bck-eng-code-challenge.git
   cd snr-bck-eng-code-challenge
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a .env file:
   ```bash
   echo "WEBHOOK_SECRET=SNR_BCK_ENG_CODE_CHALLENGE_WEBHOOK_SECRET_KEY" > .env
   echo "OVERPASS_API_URL=https://overpass-api.de/api/interpreter" >> .env
   echo "OVERPASS_RADIUS=500" >> .env
   echo "DATABASE_PATH=./database.sqlite" >> .env
   ```
4. Start the application:
   ```bash
   npm run start
   ```

## Testing

### Running e2e Tests

- The application includes end-to-end tests to verify the functionality of all endpoints. These tests ensure that the webhook, Overpass API integration, database, and caching work as expected.
- Run the e2e tests: `npm run test:e2e`

### POST /webhook

- Fetch and store landmarks near the Eiffel Tower:

  ```bash
  curl -X POST http://localhost:3000/webhook \
  -H "Authorization: Bearer SNR_BCK_ENG_CODE_CHALLENGE_WEBHOOK_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"lat\": 48.8584, \"lng\": 2.2945}"
  ```

- Expected Response:
  ```json
  {
    "message": "Coordinates processed successfully",
    "attractions": [
      {
        "id": 2,
        "name": "Tour Eiffel",
        "type": "way",
        "lat": 48.8584,
        "lng": 2.2945,
        "originalRequest": false
      },
      ...
    ]
  }
  ```

### GET /landmarks

- Retrieve landmarks near the Eiffel Tower:

  ```bash
  curl -X GET "http://localhost:3000/landmarks?lat=48.8584&lng=2.2945"
  ```

- First Request (Database):

  ```json
  {
    "message": "Landmarks retrieved from database",
    "landmarksCount": 211,
    "landmarks": [
      {
        "id": 2,
        "name": "Tour Eiffel",
        "type": "way",
        "lat": 48.8584,
        "lng": 2.2945,
        "originalRequest": false
      },
      ...
    ]
  }
  ```

- Subsequent Requests (Cache):
  ```json
  {
    "message": "Landmarks retrieved from cache",
    "landmarksCount": 211,
    "landmarks": [
      {
        "id": 2,
        "name": "Tour Eiffel",
        "type": "way",
        "lat": 48.8584,
        "lng": 2.2945,
        "originalRequest": false
      },
      ...
    ]
  }
  ```

## Error Handling

- Missing Environment Variables
  The application will fail to start if required environment variables are missing.
- Invalid Coordinates
  Returns a `400 Bad Request` if coordinates are outside valid ranges.
- Overpass API Errors
  Returns a `500 Internal Server Error` if the Overpass API is unreachable or returns an error.
- Unexpected Errors
  All unexpected errors are caught by the global exception filter and logged for debugging.

## Inspecting the SQLite Database

The application uses SQLite to store landmarks. The database file is located at `./database.sqlite`.

### Using DB Browser for SQLite

1. Download and install [DB Browser for SQLite](https://sqlitebrowser.org/).
2. Open the `database.sqlite` file in DB Browser.
3. Navigate to the `landmark` table to view stored landmarks.

### Using SQLite CLI

- Install SQLite CLI (if not already installed):
  ```bash
  sudo apt install sqlite3
  ```
- Open the database:
  ```bash
  sqlite3 ./database.sqlite
  ```
- Query the landmark table:
  ```
  SELECT * FROM landmark;
  ```
