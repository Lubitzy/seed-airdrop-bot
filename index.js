require('dotenv').config()
require('colors')
const readlineSync = require('readline-sync')
const Table = require('cli-table3')
const { initCronJobs } = require('./src/action')

const {
    getProfile,
    getBalance,
    getInventoryWorms,
    getInventoryEgg,
    getInventoryBird,
    getUserRankVillage,
    getVillage,
    getWormCatch,
    clickLatestMessage,
    seedClaim,
    autoCompleteTasks,
    upgradeStorage,
    upgradeTree,
    joinGuild,
    dailLogin
} = require('./src/api')

const { displayHeader, askUserChoice, askDefaultChoice } = require('./src/ui')

async function selectAccount() {
    console.log('Fetching your account data...\n'.green)
    const QUERY_IDS = Object.keys(process.env)
        .filter(key => key.startsWith('QUERY_ID_'))
        .map(key => process.env[key])

    const accounts = []

    const table = new Table({
        chars: {
            'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗',
            'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝',
            'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼',
            'right': '║', 'right-mid': '╢', 'middle': '│'
        },
        head: ['No'.white.bold, 'ID Telegram'.white.bold, 'Name'.white.bold, 'Balance'.white.bold],
        colWidths: [5, 20, 20, 20]
    })

    for (let i = 0; i < QUERY_IDS.length; i++) {
        try {
            const profile = await getProfile(QUERY_IDS[i])
            const balance = await getBalance(QUERY_IDS[i])
            const formattedBalance = `${(balance.data / 1000000000).toFixed(2)} SEED`

            accounts.push({ no: i + 1, id: profile.data.tg_id, name: profile.data.name, balance: formattedBalance })
            table.push([i + 1, profile.data.tg_id, profile.data.name, formattedBalance])
        } catch (error) {
            console.error('⚠️ Error fetching data for account:', error.message.red)
        }
    }

    console.log(table.toString())

    const choice = readlineSync.question('\nSelect account by number: ')
    const selectedAccount = accounts.find(acc => acc.no === parseInt(choice))
    if (selectedAccount) {
        console.log(`\n🎉 You selected: ${selectedAccount.name.green}\n`)
        return QUERY_IDS[selectedAccount.no - 1]
    } else {
        console.log('❌ Invalid choice.'.red)
        return null
    }
}

const userChoice = async (token) => {
    try {
        let exitProgram = false
        while (!exitProgram) {
            const firstChoice = readlineSync.question(askUserChoice())
            if (firstChoice === '1') {
                let exitDefaultFlow = false
                while (!exitDefaultFlow) {
                    const choiceDefaultFlow = readlineSync.question(askDefaultChoice())
                    if (choiceDefaultFlow === '1') {
                        console.log('🌾 Claiming daily login...'.cyan)
                        await dailLogin(token)
                        const clickMessage = await clickLatestMessage(token)
                        if (clickMessage) {
                            console.log('🌾 Claiming seed...'.cyan)
                            await seedClaim(token)
                        }
                    } else if (choiceDefaultFlow === '2') {
                        console.log('🐛 Catching worms...'.cyan)
                        await getWormCatch(token)
                    } else if (choiceDefaultFlow === '3') {
                        console.log('\n📦 Fetching your inventory data...\n'.cyan)
                        const worms = await getInventoryWorms(token)
                        const egg = await getInventoryEgg(token)
                        const bird = await getInventoryBird(token)

                        const table = new Table({
                            chars: {
                                'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗',
                                'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝',
                                'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼',
                                'right': '║', 'right-mid': '╢', 'middle': '│'
                            },
                            head: ['Worms'.white.bold, 'Egg'.white.bold, 'Bird'.white.bold],
                            colWidths: [10, 10, 10]
                        })

                        table.push([
                            worms.data.total,
                            egg.data.total,
                            bird.data.total
                        ])
                        console.log(table.toString())
                    } else if (choiceDefaultFlow === '4') {
                        await autoCompleteTasks(token)
                    } else if (choiceDefaultFlow === '5') {
                        const choiceUpgrade = readlineSync.question(
                            `\n🛠️  What do you want to upgrade:\n\n[1]. Storage level\n[2]. Tree level\n[0] Return to Main Menu\n\nPlease enter your choice: `.cyan
                        )
                        if (choiceUpgrade === '1') {
                            await upgradeStorage(token)
                        } else if (choiceUpgrade === '2') {
                            await upgradeTree(token)
                        } else if (choiceUpgrade === '0') {
                            break
                        } else {
                            console.log('❌ Invalid choice, please try again.'.red)
                        }
                    } else if (choiceDefaultFlow === '0') {
                        console.log('Returning to the main menu...'.yellow)
                        exitDefaultFlow = true
                    } else {
                        console.log('❌ Invalid choice, please try again.'.red)
                    }
                }
            } else if (firstChoice === '2') {
                console.log('🚧 Initializing automatic cron job flow...'.yellow)
                await initCronJobs(token)
                return
            } else if (firstChoice === '0') {
                console.log('Exiting the program...'.yellow)
                exitProgram = true
            } else {
                console.log('❌ Invalid choice, please try again.'.red)
            }
        }
    } catch (error) {
        console.error('An error occurred:', error.message.red)
    }
}

const main = async () => {
    try {
        displayHeader()

        const selectedSessionKey = await selectAccount()
        if (!selectedSessionKey) {
            console.log('❌ No session key found. Exiting.'.red)
            return
        }

        const username = await getProfile(selectedSessionKey)
        const balance = await getBalance(selectedSessionKey)

        const userRank = await getUserRankVillage(selectedSessionKey)
        if (!userRank || !userRank.data || !userRank.data.guild_id) {
            console.error('🏰 Your account is not currently part of any guild.'.yellow)

            const joinGuildChoice = readlineSync.question('Would you like to join the Village "AIRDROPFIND"? (yes/no): '.cyan).toLowerCase()

            if (joinGuildChoice === 'yes') {
                console.log('⏳ Joining the Village "AIRDROPFIND"...'.cyan)
                const joinResult = await joinGuild(selectedSessionKey)
                if (joinResult) {
                    console.log('✅ Successfully joined the Village "AIRDROPFIND"!'.green)
                } else {
                    console.log('❌ Failed to join the Village "AIRDROPFIND". Please try again.'.red)
                }
            } else if (joinGuildChoice === 'no') {
                console.log('❌ You have chosen not to join any guild at this time.'.yellow)
                await userChoice(selectedSessionKey)
            } else {
                console.log('❌ Invalid choice. Please respond with "yes" or "no".'.red)
            }
            return
        }

        const idVillage = userRank.data.guild_id
        const village = await getVillage(selectedSessionKey, idVillage)

        if (!village || !village.data) {
            console.error('❌ Error: Unable to retrieve village information.'.red)
            return
        }

        const earnVillage = village.data.hunted
        const reward = village.data.reward
        const rewardVillage = `${(reward / 1000000000).toFixed(2)} SEED`
        const earningVillage = `${(earnVillage / 1000000000).toFixed(2)} SEED`
        const formattedBalance = `${(balance.data / 1000000000).toFixed(2)} SEED`

        console.log(`👋 Hello, ${username.data.name}!`.green.bold)
        console.log(`💰 Your current SEED balance is: ${formattedBalance}`.green.bold)
        console.log('')
        console.log('🏰 Here are your guild details:\n'.bold)
        if (village) {
            console.log(`   - Name: ${village.data.name}`)
            console.log(`   - Reward: ${rewardVillage}`)
            console.log(`   - Earned Balance: ${earningVillage}`)
            console.log(`   - Total Members Joined: ${village.data.number_member}/50000`)
            console.log(`   - Your Rank in the Village: ${userRank.data.member_rank}`)
            console.log(`   - Guild Rank Category: ${village.data.guild_rank}`)
            console.log('')
        }
        userChoice(selectedSessionKey)
    } catch (error) {
        console.error('An error occurred:', error.message.red)
    }
}

main()
