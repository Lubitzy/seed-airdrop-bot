const axios = require('axios')
require('colors')
const { delay } = require('./sleep')

async function getProfile(token) {
    try {
        const { data } = await axios({
            url: 'https://elb.seeddao.org/api/v1/profile2',
            method: 'GET',
            headers: { "Telegram-data": token }
        })
        return data
    } catch (error) {
        console.error('❌ Error fetching profile data:', error.message.red)
    }
}

async function getBalance(token) {
    try {
        const { data } = await axios({
            url: 'https://elb.seeddao.org/api/v1/profile/balance',
            method: 'GET',
            headers: { "Telegram-data": token }
        })
        return data
    } catch (error) {
        console.error('❌ Error fetching balance data:', error.message.red)
    }
}

async function getInventoryWorms(token) {
    try {
        const { data } = await axios({
            url: 'https://elb.seeddao.org/api/v1/worms/me',
            method: 'GET',
            headers: { "Telegram-data": token }
        })
        return data
    } catch (error) {
        console.error('❌ Error fetching worm inventory:', error.message.red)
    }
}

async function getInventoryEgg(token) {
    try {
        const { data } = await axios({
            url: 'https://elb.seeddao.org/api/v1/egg/me',
            method: 'GET',
            headers: { "Telegram-data": token }
        })
        return data
    } catch (error) {
        console.error('❌ Error fetching egg inventory:', error.message.red)
    }
}

async function getInventoryBird(token) {
    try {
        const { data } = await axios({
            url: 'https://elb.seeddao.org/api/v1/bird/me',
            method: 'GET',
            headers: { "Telegram-data": token }
        })
        return data
    } catch (error) {
        console.error('❌ Error fetching bird inventory:', error.message.red)
    }
}

async function getUserRankVillage(token) {
    try {
        const { data } = await axios({
            url: 'https://elb.seeddao.org/api/v1/guild/member/detail',
            method: 'GET',
            headers: { "Telegram-data": token }
        })
        return data
    } catch (error) {
        console.error('❌ Error fetching user rank in village:', error.message.red)
    }
}

async function joinGuild(token) {
    try {
        const { data } = await axios({
            url: 'https://elb.seeddao.org/api/v1/guild/join',
            method: 'POST',
            headers: { "Telegram-data": token },
            data: { guild_id: "cbcaf320-6645-459c-916b-4e19152984fa" }
        })
        return data
    } catch (error) {
        console.error('❌ Error joining the guild:', error.message.red)
    }
}

async function dailLogin(token) {
    try {
        const response = await axios({
            url: 'https://elb.seeddao.org/api/v1/login-bonuses',
            method: 'POST',
            headers: { "Telegram-data": token }
        })
        if (response.status === 200) {
            console.log('✅ Daily login claimed successfully!'.green)
        }
        return response.data
    } catch (error) {
        if (error.response && error.response.data.message === 'already claimed for today') {
            console.error('❌ Daily login has already been claimed today.'.yellow)
        } else {
            console.error('❌ Error claiming daily login:', error.message.red)
        }
    }
}

async function getVillage(token, idVillage) {
    try {
        const { data } = await axios({
            url: `https://elb.seeddao.org/api/v1/guild/detail?guild_id=${idVillage}`,
            method: 'GET',
            headers: { "Telegram-data": token }
        })
        return data
    } catch (error) {
        console.error('❌ Error fetching village data:', error.message.red)
    }
}

async function getWormCatch(token) {
    try {
        const response = await axios({
            url: 'https://elb.seeddao.org/api/v1/worms/catch',
            method: 'POST',
            headers: { "Telegram-data": token }
        })

        if (response.status === 200) {
            console.log('✅ Worms caught successfully!'.green)
        }
        return response.data

    } catch (error) {
        if (error.response) {
            if (error.response.status === 400) {
                console.error('⚠️  Worm already caught.'.yellow)
            } else if (error.response.status === 404 || error.response.data.message === 'worm disappeared') {
                console.error('⚠️  Worms have already been caught.'.yellow)
            } else {
                console.error('❌ Error catching worms:', error.message.red)
            }
        } else {
            console.error('❌ Error catching worms:', error.message.red)
        }
    }
}

async function clickLatestMessage(token) {
    try {
        const { data } = await axios({
            url: 'https://elb.seeddao.org/api/v1/latest-message',
            method: 'GET',
            headers: { "Telegram-data": token }
        })
        return data
    } catch (error) {
        console.error('❌ Error clicking latest message:', error.message.red)
    }
}

async function seedClaim(token) {
    try {
        const response = await axios({
            url: 'https://elb.seeddao.org/api/v1/seed/claim',
            method: 'POST',
            headers: { "Telegram-data": token }
        })
        if (response.status === 200) {
            console.log('✅ SEED claimed successfully!'.green)
        }
    } catch (error) {
        if (error.response && error.response.status === 400) {
            console.error('⚠️  Claim too early. Please try again later.'.yellow)
        } else if (error.response && error.response.data.message === 'claim to early') {
            console.error('⚠️  Claim too early. Please wait before claiming again.'.yellow)
        } else {
            console.error('❌ Error claiming SEED:', error.message.red)
        }
    }
}

async function getAllTask(token) {
    try {
        const { data } = await axios({
            url: 'https://elb.seeddao.org/api/v1/tasks/progresses',
            method: 'GET',
            headers: { "Telegram-data": token }
        })
        if (Array.isArray(data.data)) {
            return data.data.map(task => ({
                id: task.id,
                name: task.name,
                completed: task.task_user ? task.task_user.completed : false
            }))
        } else {
            console.error('❌ Unexpected data format:', data)
            return []
        }
    } catch (error) {
        console.error('❌ Error fetching tasks:', error.message.red)
        return []
    }
}

async function completeAllTask(token, id) {
    try {
        const { data } = await axios({
            url: `https://elb.seeddao.org/api/v1/tasks/${id}`,
            method: 'POST',
            headers: { "Telegram-data": token }
        })
        return data.data
    } catch (error) {
        console.error('❌ Error completing task:', error.message.red)
        return null
    }
}

async function getNotification(token, id, title) {
    try {
        const { data } = await axios({
            url: `https://elb.seeddao.org/api/v1/tasks/notification/${id}`,
            method: 'GET',
            headers: { "Telegram-data": token }
        })
        return data
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return { manual: true }
        } else {
            console.error(`❌ Error fetching notification for task '${title}': ${error.message}`.red)
        }
    }
}

async function autoCompleteTasks(token) {
    console.log('\n✅ Auto completing tasks...'.yellow)
    const tasks = await getAllTask(token)

    const manualTaskSet = new Set()

    for (const task of tasks) {
        if (task.completed) {
            console.log(`✅ Task ${task.name} has already been claimed!`)
        } else {
            const completedTaskData = await completeAllTask(token, task.id)
            if (!completedTaskData) {
                console.log(`❌ Failed to complete task '${task.name}'.`.red)
                continue
            }

            const notification = await getNotification(token, completedTaskData, task.name)

            if (notification && notification.manual) {
                if (!manualTaskSet.has(task.name)) {
                    console.log(`⚠️  Task '${task.name}' requires manual completion. Please handle it manually.`.yellow)
                    manualTaskSet.add(task.name)
                }
                continue
            }
            console.log(`🎉 Task '${task.name}' completed successfully!`.green)
            await delay(5000)
        }
    }
}

async function upgradeStorage(token) {
    try {
        const response = await axios({
            url: 'https://elb.seeddao.org/api/v1/seed/storage-size/upgrade',
            method: 'POST',
            headers: { "Telegram-data": token }
        })
        if (response.status === 200) {
            console.log('✅ Storage upgraded successfully!'.green)
        }
    } catch (error) {
        if (error.response && error.response.data.message === 'not enough seed to upgrade') {
            console.error('❌ Not enough SEED to upgrade storage.'.yellow)
        } else {
            console.error('❌ Error upgrading storage:', error.message.red)
        }
    }
}

async function upgradeTree(token) {
    try {
        const response = await axios({
            url: 'https://elb.seeddao.org/api/v1/seed/mining-speed/upgrade',
            method: 'POST',
            headers: { "Telegram-data": token }
        })
        if (response.status === 200) {
            console.log('✅ Tree mining speed upgraded successfully!'.green)
        }
    } catch (error) {
        if (error.response && error.response.data.message === 'not enough seed to upgrade') {
            console.error('❌ Not enough SEED to upgrade tree mining speed.'.yellow)
        } else {
            console.error('❌ Error upgrading tree:', error.message.red)
        }
    }
}

module.exports = {
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
}
