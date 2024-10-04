# SEED Airdrop Bot

🚀 **SEED Airdrop Bot** is an automation tool designed to manage airdrop tasks on the SEED platform. The bot supports both manual and automated task completion modes, streamlining the process of earning rewards efficiently.

## Features

- **User Balance Information**: Fetch and display the user’s balance, including Telegram ID, Username, balance, tribe, and position.
- **Automated Task Completion**: Automatically complete all available tasks on the platform.
- **Auto Claim Rewards**: Automatically claim your earned rewards with ease.
- **Full Automation Flow**: A combination of Auto Claim, farming tasks, and daily login management through a Cron job.

## Prerequisites

To run the SEED Airdrop Bot, ensure that you have the following installed:

- **Node.js** (v12 or higher)
- **npm** (Node Package Manager)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Lubitzy/seed-airdrop-bot.git
   ```

2. Navigate to the project directory:

   ```bash
   cd seed-airdrop-bot
   ```

3. Install the required dependencies:

   ```
   npm install
   ```

4. Set up environment variables:

    - Create a `.env` file in the project root directory.
    - Add your SEED API token and Query IDs in the `.env` file as follows:
        ```bash
        # Example .env configuration
        QUERY_ID_1=your_seed_queryid_1
        QUERY_ID_2=your_seed_queryid_2
        QUERY_ID_3=your_seed_queryid_3
        ```

5. Start the application:

   ```
   npm start
   ```

## Usage

Once the bot is running, it will display your current balance information (Telegram ID, Username, balance, tribe, and position). You can select one of the following options from the main menu:

   - **Default Flow**
     - Auto Claim SEED & Daily Login
     - Catch Worms
     - Check Your Inventory
     - Auto Complete All Tasks
     - Auto Upgrade Boost (Tree and Storage Only)
   - **Automatic Flow**: Combine Auto Claim Farm and auto daily login using Cron job.
   - **Exit**: Close the application.

The selected action will be executed, and detailed information about the performed tasks and obtained rewards will be displayed in the console.

## Getting Your Tokens

1. **Session Storage:**
   - Open the [airdrop bot](t.me/seed_coin_bot/app?startapp=1191390170).
   - Open your browser’s developer tools (usually F12 or right-click > Inspect).
   - Navigate to the **Application** tab.
   - Look for the **Session Storage** section.
   - Find and copy the key `__init__Params` value of `tgWebAppData`

## Contributing

We welcome contributions! If you encounter any issues or have suggestions for improvement, feel free to open an issue or submit a pull request. We appreciate your help in making this project better.

## Donations

If you'd like to support the development of this project, you can contribute to the following addresses:

- **Solana**: `EFBkqR2NtoAYRhtgziTESc2PtAgaGLc8wuTmajBXdfuh`
- **EVM**: `0xE3A3B2b44e5244Eb4159101FDFD596937E54D092`
- **BTC**: `bc1pawnaeky4rks2rkq0rh2ejh3kuuavnqzhvgtckh58nsd69ncfwsssmcdtsc`

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For further inquiries, you can reach out via:

- **Developer:** Lubitzy
- **Telegram:** [Lubiqt](https://t.me/Lubiqt)
