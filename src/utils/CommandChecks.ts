import { Command, Message } from 'eris'
import { Client } from 'structures/Client'

export default async (message: Message): Promise<boolean> => {

    //@ts-ignore
    const client: Client = message._client
    const command: Command = message.command as Command
    const requirements: any = message.command?.requirements

    const guildData = await client.utils.getGuildData(message.guildID as string)

    if (process.env['DEBUG_MODE'] === 'true') {
        client.logger.info('COMMAND', `Executed command ${command.label}`)
    }

    if (requirements) {
        // Requirement userIDs
        if (requirements.userIDs?.length) {
            if (!requirements.userIDs.includes(message.author.id)) {
                return false
            }
        }
    }

    if (client.config.devBypass) {
        return true
    }

    // If user has required permissions, grant true
    if (client.config.bypassPermissions.length > 0) {
        const hasPerms = client.config.bypassPermissions.filter(perm => message.member?.permissions.has(perm as any))
        if (hasPerms.length > 0) return true
    }

    if (!guildData) return true // If no guildData, return true since it hasn't been set up yet

    if (command.category.toUpperCase() == 'MUSIC')

        // Check DJOnly
        if (guildData.DJRoleOnly && guildData.DJRole) {
            if (!message.member?.roles.includes(guildData.DJRole)) {
                const msg = await message.channel.createMessage('You need to have the DJ role to use this.')
                setTimeout(() => {
                    msg.delete()
                }, 5000)
                return false
            }
        }

    // Check music channel only
    if (guildData.musicChannelOnly && guildData.musicChannel) {
        if (message.channel.id !== guildData.musicChannel) {
            const msg = await message.channel.createMessage(`You can only use this command in the music channel (<#${guildData.musicChannel}>).`)
            setTimeout(() => {
                msg.delete()
            }, 5000)
            return false
        }
    }

    // Else passed check
    return true
}
