import { Component, Input } from '@angular/core';

export interface DosDontsListProps {

  /**
   * title of do column
   *
   * @type {string}
   * @memberof DosDontsListProps
   */
  doTitle?: string;

  /**
   * List of acceptable items
   *
   * @type {string[]}
   * @memberof DosDontsListProps
   */
  doList?: string[];

  /**
   * title of don't column
   *
   * @type {string}
   * @memberof DosDontsListProps
   */
  dontTitle?: string;

  /**
   * List of unacceptable items
   *
   * @type {string[]}
   * @memberof DosDontsListProps
   */
  dontList?: string[];
}

@Component({
  selector: 'abgov-forms-dos-donts-list',
  templateUrl: './dos-donts-list.component.html',
  styleUrls: ['./dos-donts-list.component.scss']
})
export class DosDontsListComponent implements Required<DosDontsListProps> {

  @Input()
  doTitle = "Do"

  @Input()
  dontTitle = "Don't"

  @Input()
  doList: string[] = []

  @Input()
  dontList: string[] = []

}
