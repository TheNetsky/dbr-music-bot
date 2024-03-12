import { Command, CommandRequirements, Message } from 'eris'
import { Client } from 'structures/Client'

export default async (message: Message): Promise<boolean> => {

    // @ts-expect-error Is valid
    const client: Client = message._client
    const command: Command = message.command as Command
    const requirements: CommandRequirements = message.command?.requirements as CommandRequirements

    if (process.env['DEBUG_MODE'] === 'true') {
        client.logger.info('COMMAND', `Executed command ${command.label}`)
    }

    if (requirements) {
        // Requirement userIDs
        if (requirements.userIDs?.length) {
            // @ts-expect-error Is valid
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

    // Restrict config commands to users with "manageMessages" permission
    if (command.category.toUpperCase() == 'CONFIG') {
        if (!message.member?.permissions.has('manageMessages')) {
            const msg = await message.channel.createMessage('You need to have the `Manage Messages` permission to change the configuration.')
            setTimeout(() => {
                msg.delete()
            }, 5000)
            return false
        }
    }

    if (command.category.toUpperCase() == 'MUSIC')

        // Check DJOnly
        if (client.config.preferences.DJRoleOnly && client.config.preferences.DJRole) {
            if (!message.member?.roles.includes(client.config.preferences.DJRole)) {
                const msg = await message.channel.createMessage('You need to have the DJ role to use this.')
                setTimeout(() => {
                    msg.delete()
                }, 5000)
                return false
            }
        }

    // Check music channel only
    if (client.config.preferences.musicChannelOnly && client.config.preferences.musicChannel) {
        if (message.channel.id !== client.config.preferences.musicChannel) {
            const msg = await message.channel.createMessage(`You can only use this command in the music channel (<#${client.config.preferences.musicChannel}>).`)
            setTimeout(() => {
                msg.delete()
            }, 5000)
            return false
        }
    }

    // Else passed check
    return true
}
