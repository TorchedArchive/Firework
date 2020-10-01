declare module '@luvella/firework' {
  import * as loggaby from 'loggaby';
  import * as eris from 'eris';

  /**
   * Entry-point of the framework
   */
  namespace firework {
    type MaybePromise<T> = T | Promise<T>;
    interface CommandOptions {
      description?: string;
      examples?: string[];
      aliases?: string[];
      devOnly?: boolean;
      hidden?: boolean;
      usage?: string;
      name: string;
    }

    interface ClientOptions extends eris.ClientOptions {
      templateEmbed?: eris.EmbedOptions;
      clientValues?: {
        [K in keyof eris.Client]?: eris.Client[K];
      }
    }

    export abstract class BaseCommand {
      constructor(bot: firework.Client, opts: firework.CommandOptions);

      public settings: firework.CommandOptions;
      public bot: firework.Client;

      public abstract run(): firework.MaybePromise<void>;
    }

    export class Client extends eris.Client {
      constructor(config: object, options: firework.ClientOptions); // TODO: what is `config`?

      public commands: firework.Collection<firework.BaseCommand> & { aliases: firework.Collection<string> };
      public config: object;
      public logger: loggaby.Logger;
      public addTemplateValues(embed: eris.EmbedOptions): void;
      public overrideTemplateEmbed(embed: eris.EmbedOptions): void;
    }

    export class Collection<T = unknown> extends Map<string, T> {
      public filter<This = any>(fn: (this: This, value: T, key: string, collection: Collection<T>) => boolean, thisArg?: This): T[];
      public map<S, This = any>(fn: (this: This, value: T, key: string, collection: Collection<T>) => S, thisArg?: This): S[];
    }

    export class Log extends loggaby.Logger {
      public commands(msg: string, color?: boolean, logFunc?: Function): void;
      public shard(msg: string, id?: number, color?: boolean, logFunc?: Function): void;
    }

    export namespace utils {
      export function objDeepMerge<T extends object, U = T>(...objs: T[]): U;
    }
  }

  export = firework;
}
