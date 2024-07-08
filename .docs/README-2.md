### Run: exports data from ATOMS into JSON files
`dotnet run -p .custom-tools/apprenticeship-legacy`

- exports JSON file for `apprenticeship-wip-api` database
- exports JSON files for `credential-api` database

### Update local DB: manually
1. Move the generated JSON container files into appropraite location in `.data` folder of repository
```
dio-ae-digital\.data\cosmosdb\<database-name>\<container-name>.json
```
2. commit these changes to a temporary branch for testing
3. pull the changes on your developer local machine
4. run `yarn data:import-cosmos-db` to load data into local CosmosDB instance.
### Prerequisites

- get permission to access database server: `edm-goa-sql-578\ams`
- get permission to access database `ATOMS-STAE-DEV`
- run on GOA network

### Configuration
Output directories is hardcoded in each `Exporter`
- `Exporters/ApprentishipWipApi/Exporter.cs`
- `Exporters/CredentialApi/Exporter.cs`

Db connection string is hardcoded in
- `Gateways/Query/AtomsQueryGateway.cs`

### Exporting new data
1. Create `Export<container>` directory for the new CosmosDB container
2. Create ATOMS db model that implements `ISqlQuery` which will contain the SQL query to ATOMS
3. Create `Export<container>Request` that implements `IRequest`
4. Create `Export<container>RequestHandler` that implements `AsyncRequestHandler<IRequest>`
5. Add the request to the appropriate `Exporter`, using MediatR to send the request.
