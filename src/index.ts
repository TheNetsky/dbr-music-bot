import { Client } from './Base/Client'
import Listenerhandler from './Util/listenerHandler'


const Base = new Client()

Base.init()
new Listenerhandler(Base)