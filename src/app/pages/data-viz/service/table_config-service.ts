import { Injectable } from '@angular/core';
import { Config, STYLE, THEME } from 'ngx-easy-table';

@Injectable()
export class ConfigurationService {
  public static config: Config = {
    searchEnabled: true,
    headerEnabled: true,
    orderEnabled: true,
    orderEventOnly: false,
    // globalSearchEnabled: true,
    paginationEnabled: true,
    exportEnabled: true,
    clickEvent: true,
    selectRow: false,
    selectCol: false,
    selectCell: true,
    rows: 50,
    additionalActions: false,
    serverPagination: false,
    isLoading: false,
    detailsTemplate: false,
    groupRows: false,
    paginationRangeEnabled: true,
    collapseAllRows: false,
    checkboxes: false,
    resizeColumn: true,
    fixedColumnWidth: false,
    horizontalScroll: true,
    draggable: false,
    logger: false,
    showDetailsArrow: false,
    showContextMenu: false,
    persistState: false,
    paginationMaxSize: 5,
    threeWaySort: false,
    tableLayout: {
      style: STYLE.NORMAL, // or STYLE.BIG or STYLE.TINY
      theme: THEME.LIGHT, // or THEME.LIGHT
      borderless: false,
      hover: true,
      striped: true,
    },
  };
}
