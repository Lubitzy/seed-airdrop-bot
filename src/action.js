const { CronJob } = require('cron')
const { seedClaim, getWormCatch, clickLatestMessage } = require('./api')
const { delay } = require('./sleep')

async function initCronJobs(token) {
    await performInitialRun(token)

    const seedJob = new CronJob('0 0 */4 * * *', async () => {
        console.log('🌾 Attempting to claim seed after 4 hours...'.cyan)
        await performSeedClaim(token)
    })

    const wormJob = new CronJob('0 0 */5 * * *', async () => {
        console.log('🐛 Attempting to catch worms after 5 hours...'.cyan)
        await performWormCatch(token)
    })

    seedJob.start()
    wormJob.start()

    console.log('🌾 Running seed claim job every 4 hours...'.green.bold)
    console.log('🐛 Running worm catch job every 5 hours...'.green.bold)
    console.log('✅ Cron jobs initialized successfully!'.green.bold)
}

async function performSeedClaim(token) {
    const clickMessage = await clickLatestMessage(token)
    if (clickMessage) {
        await seedClaim(token)
    }
}

async function performWormCatch(token) {
    await getWormCatch(token)
}

async function performInitialRun(token) {
    console.log('🚀 Performing initial SEED claim and worm catch...'.cyan)
    await performSeedClaim(token)
    await delay(10000)
    await performWormCatch(token)
    console.log('✅ Initial tasks completed. Scheduling next tasks...'.green.bold)
}

module.exports = {
    initCronJobs,
}
