# RFQ Client - Demo Web Application

A demo web application showing how to use the Northstake API/SDK ecosystem to manage Ethereum validator operations, including RFQs, wallets, and webhooks.

## Table of Contents

- [Introduction](#introduction)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Usage](#usage)
- [API Integration](#api-integration)
- [Contributing](#contributing)
- [License](#license)

## Introduction

This project is a demo example and should not be deployed as a production tool without further work. It demonstrates how to use the [Northstake API/SDK](https://www.npmjs.com/package/@northstake/northstakeapi) to manage Ethereum validator operations, including RFQs, wallets, and webhooks.

## Getting Started

First, clone the repository:

```bash
git clone https://github.com/northstake/northstake-validator-dashboard
cd rfq-client
```

Install the dependencies:

```bash
npm install
# or
yarn install
```

## Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```
API_KEY=your_api_key
PRIVATE_KEY=your_private_key
NEXT_PUBLIC_SERVER=<test|prod>
```

Note that your private key is sensitive information and should not be exposed to the public.
The private key should be one line, with line breaks replaced with `\n`. For example:

```
API_KEY=your_api_key
PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDQ5ZK8k+vR\n...
NEXT_PUBLIC_SERVER=<test|prod>

```

## Scripts

The following scripts are available:

- `npm run dev`: Runs the development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint to check for linting errors.

## Usage

To start the development server, run:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API Integration

This project makes use of the [Northstake API/SDK](https://www.npmjs.com/package/@northstake/northstakeapi) to orchestrate API operations. The API context is set up in `context/ApiContext.tsx` and used throughout the application to manage API interactions.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

## License

This project is licensed under the MIT License.
