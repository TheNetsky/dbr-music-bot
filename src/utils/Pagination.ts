import * as DJS from 'eris'
import * as EmbedPaginator from 'eris-pagination'

export class Pagination {
  client: DJS.Client
  msg: DJS.Message
  pages: Array<any>
  constructor(client, msg, pages) {
    this.client = client
    this.msg = msg
    this.pages = pages
  }


  async start() {

    const options = {
      showPageNumbers: false,
      extendedButtons: true,
      firstButton : '⏮',
      lastButton : '⏭',
      deleteButton : '🗑'
    }

    await EmbedPaginator.createPaginationEmbed(this.msg, this.pages, options)
  }
}

