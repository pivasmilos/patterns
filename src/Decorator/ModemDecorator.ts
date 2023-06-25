export type VolumeType = "low" | "high";
export type ModemTypes = "Hayes" | "USR";

export class Modem {
  dial(number: string): void {
    console.log(`Dialing ${number}...`);
  }

  setSpeakerVolume(volume: VolumeType): void {
    console.log(`Setting speaker volume to ${volume}...`);
  }
}

export class HayesModem extends Modem {
  override dial(number: string): void {
    console.log(`Dialing ${number} using Hayes modem...`);
  }
}

export class USRModem extends Modem {
  override dial(number: string): void {
    console.log(`Dialing ${number} using USR modem...`);
  }
}

export class ModemControlProgram {
  private readonly users: Record<string, { user: User; modem: Modem }> = {};

  constructor(private readonly modemType: ModemTypes) {}

  public getModemType(): ModemTypes {
    return this.modemType;
  }

  addUser(user: User, modem: Modem): void {
    this.users[user.name] = { user, modem };
  }

  dial(number: string, userName: string): void {
    const userModem = this.users[userName];

    if (!userModem) {
      console.log(`User ${userName} is not registered in the modem control program!`);
      return;
    }

    console.log(`Dialing ${number} on behalf of ${userName}...`);
    userModem.modem.dial(number);
  }
}

export class LoudDialModem extends Modem {
  constructor(private readonly modem: Modem) {
    super();
  }

  override dial(number: string): void {
    console.log(`Dialing ${number} loudly...`);
    this.modem.dial(number);
  }
}

export class QuietDialModem extends Modem {
  constructor(private readonly modem: Modem) {
    super();
  }

  override dial(number: string): void {
    console.log(`Dialing ${number} quietly...`);
    this.modem.dial(number);
  }
}

/**
 * Modem factory
 */
export function createModem(speakerVolume: VolumeType, modemType: ModemTypes = "Hayes"): Modem {
  const baseModem = modemType === "Hayes" ? new HayesModem() : new USRModem();
  if (speakerVolume === "low") {
    return new QuietDialModem(baseModem);
  } else {
    return new LoudDialModem(baseModem);
  }
}

export class User {
  constructor(public readonly name: string, public readonly speakerVolume: VolumeType) {}

  dial(number: string, modemControlProgram: ModemControlProgram): void {
    const modem = createModem(this.speakerVolume, modemControlProgram.getModemType());
    modemControlProgram.addUser(this, modem);
    modemControlProgram.dial(number, this.name);
  }
}
