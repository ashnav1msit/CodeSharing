import { Injectable } from '@angular/core';

/**
 * Class responsible for providing a mechanism for storing work in progress form data
 *
 * @export
 * @abstract
 * @class FormStorageService
 */
@Injectable()
export abstract class FormStorageService {
  // todo: might want to expose some options (i.e. saveOnChange etc, saveFrequency etc)

  // todo: probably need to expand key to make it safe (so that people can't overwrite others form data)
  abstract save<T = any>(key: string, data: T): Promise<string>;

  abstract get<T = any>(key: string): Promise<T | undefined>;

  // todo: A getAll for fetching list of in progress forms
}
