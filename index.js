'use strict';

class gacha {
	
	constructor(mod) {
		
		this.mod = mod;
		this.command = mod.command;
		this.hook = null;
		var enabled, gachaId;
		enabled = true;
		gachaId = 0;
		
		// command
		mod.command.add('gacha', {
			'$none': () => {
				enabled = !enabled;
			this.send(`${enabled ? 'En' : 'Dis'}abled.`);
			},
			'$default': () => {
				this.send(`Invalid argument.`);
			}
		});
		
		// network
		this.hook = mod.hook('S_REQUEST_CONTRACT', 1, (e) => {
			if (e.type !== 53) {
				return;
			} else {
				gachaId = e.id;
			}
		});
		
		this.hook = mod.hook('S_GACHA_START', 2, (e) => {
			if (enabled && gachaId) {
				this.mod.send('C_GACHA_TRY', 2, {
					id:	gachaId,
					amount:	1
				});
				return false;
			}
		});
		
		this.hook = mod.hook('S_GACHA_END', 3, (e) => {
			if (enabled && gachaId) {
				this.mod.send('C_GACHA_CANCEL', 1, (e) => {
					id:	gachaId
				});
				gachaId = 0;
			}
		});
	}
	
	// send
	send(message) {
		this.command.message(': ' + message);
	}
	
	destructor() {
		this.command.remove('gacha');
		this.mod.unhook(this.hook);
		this.hook = null;
	}
	
}

module.exports = { NetworkMod: gacha };
