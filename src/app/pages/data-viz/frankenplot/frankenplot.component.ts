import { Component, OnInit, TemplateRef, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { DataVizFrankenplotsService} from '../service/data-viz-frankenplots.service';
import { ToasterConfig } from 'angular2-toaster';

import 'style-loader!angular2-toaster/toaster.css';
import { NbGlobalLogicalPosition, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { NbToastStatus } from '@nebular/theme/components/toastr/model';
import { NbDialogService } from '@nebular/theme';
import { ShowcaseDialogComponent } from '../../modal-overlays/dialog/showcase-dialog/showcase-dialog.component';
import igv from 'igv';

// table  modules
import { LocalDataSource } from 'ng2-smart-table';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { ConfigurationService } from '../service/table_config-service';

@Component({
  selector: 'ngx-frankenplot',
  templateUrl: './frankenplot.component.html',
  styleUrls: ['./frankenplot.component.scss'],
})
export class FrankenplotComponent implements OnInit, AfterViewInit {


  /* ngx easy table data*/
  public configuration: Config = ConfigurationService.config;
  public columns: Columns[] = [ ];
  public ngx_data = [ ];
  public columns_somatic: Columns[] = [ ];
  public ngx_data_somatic = [ ];
  public columns_germline: Columns[] = [ ];
  public ngx_data_germline = [ ];
  public somatic_variant_filename;
  public germline_variant_filename;
  public save_germline_status = false;
  public save_somatic_status = false;
  public ngx_selected_row_data = {};

  // action button edit
  @ViewChild('actionTpl') actionTpl: TemplateRef<any>;
  @ViewChild('actionSomaticTpl') actionSomaticTpl: TemplateRef<any>;
  @ViewChild('germLineTag' ) germLineTag: TemplateRef<any>;
  @ViewChild('somaticTag' ) somaticTag: TemplateRef<any>;
  @ViewChild('gtag') gtag: ElementRef<any>;
  @ViewChild('gcall') gcall: ElementRef<any>;
  @ViewChild('stag') stag: ElementRef<any>;
  @ViewChild('scall') scall: ElementRef<any>;
  @ViewChild('notes_germline') notes_germline: ElementRef<any>;
  @ViewChild('notes_somatic') notes_somatic: ElementRef<any>;
  @ViewChild('germLineCall' ) germLineCall: TemplateRef<any>;
  @ViewChild('somaticCall' ) somaticCall: TemplateRef<any>;
  @ViewChild('germLineNotes' ) germLineNotes: TemplateRef<any>;
  @ViewChild('somaticNotes' ) somaticNotes: TemplateRef<any>;
  editRow: number;
  editRow_somatic: number;

  public plotnames = ['plot_AR', 'variant_allelic', 'snpratio'];
  public plot_data = {};
  public options = [];
  public options_capture = [];
  public options_project = ['PROBIO', 'PSFF'];
  public capture_dataModel = '';
  public dataModel = '';
  public geneDataModel = '';
  public project_dataModel = '';
  public graph = {
    data: [
      { x: [1, 2, 3], y: [2, 6, 3], type: 'scatter', mode: 'lines+points', marker: {color: 'red'} },
      { x: [1, 2, 3], y: [2, 5, 3], type: 'bar' },
    ],
    layout: {width: 320, height: 240, title: 'A Fancy Plot'},
  };
  config = {
    displayKey: 'Search samples',
    search: true,
    placeholder: 'Select Sample ',
    // limitTo: 20,
    customComparator: () => {},
    sort: false,
    height: '350px',
    moreText: 'more',
    noResultsFound: 'No Samples found!',
    searchPlaceholder: 'Sample Name',
  };
  config_capture = {
    displayKey: 'Search Capture Design',
    search: true,
    placeholder: 'Select Capture Design ',
    // limitTo: 20,
    height: 'auto',
    moreText: 'more',
    noResultsFound: 'No Capture Design found!',
    searchPlaceholder: 'Capture Design Name',
  };
  config_project = {
    displayKey: 'Search Project',
    search: false,
    placeholder: 'Select Project ',
    // limitTo: 20,
    height: 'auto',
    moreText: 'more',
    noResultsFound: 'No Capture Design found!',
    searchPlaceholder: 'Capture Design Name',
  };
  // image config
  image_config = {
  btnClass: 'default', // The CSS class(es) that will apply to the buttons
  zoomFactor: 0.1, // The amount that the scale will be increased by
  containerBackgroundColor: '#ccc', // The color to use for the background. This can provided in hex, or rgb(a).
  wheelZoom: true, // If true, the mouse wheel can be used to zoom in
  allowFullscreen: true, // If true, the fullscreen button will be shown, allowing the user to entr fullscreen mode
  allowKeyboardNavigation: true, // If true, the left / right arrow keys can be used for navigation
  btnIcons: { // The icon classes that will apply to the buttons. By default, font-awesome is used.
    zoomIn: 'fa fa-plus',
    zoomOut: 'fa fa-minus',
    rotateClockwise: 'fa fa-repeat',
    rotateCounterClockwise: 'fa fa-undo',
    next: 'fa fa-arrow-right',
    prev: 'fa fa-arrow-left',
    fullscreen: 'fa fa-arrows-alt',
  },
  btnShow: {
    zoomIn: true,
    zoomOut: true,
    rotateClockwise: false,
    rotateCounterClockwise: false,
    next: true,
    prev: true,
  },
  };
  franken_images_url_list = [];
  show_plots_panel: boolean = false;
  geneOptions = [];
  public franken_gene_position = {};
  public franken_plot_revision = 0;
  public geneConfig = {
    displayKey: 'Search Gene',
    search: true,
    placeholder: 'Select Gene ',
    limitTo: 10,
    moreText: 'more',
    noResultsFound: 'No Gene found!',
    searchPlaceholder: 'Go to gene',
  };
  // spinner class
   public spinner_container = {
  'position': 'absolute',
  'width': '60px',
  'height': '60px',
  'margin': 'auto',
  'padding': '10px',
  'background-color': 'rgba(0, 0, 0, 0.0)',
  'border-radius': '25%'};

   // IGV  Plots.
  @ViewChild('myDiv') igvmyDiv: ElementRef;
  public igv_options =    {
      genome: 'hg38',
      locus: 'chr8:127,736,588-127,739,371',
  };
  public igvBrowser;

  // table variables
  public table_loading_error_data = {
    'structural_variants' : 'Loading...',
    'germline_variants' : 'Loading...',
    'somatic_variants' : 'Loading...',
  };
  public settings = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    actions: false,
  };
  public source: LocalDataSource = new LocalDataSource();

  public settings_somatic = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    actions: false,
  };
  public source_somatic: LocalDataSource = new LocalDataSource();

  public settings_germline = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    actions: false,
  };
  public source_germline: LocalDataSource = new LocalDataSource();
  public igv_session_button_status = true;
  public snpratio_height = 0;

  constructor(public frankenplotService: DataVizFrankenplotsService, private toastrService: NbToastrService,
              private dialogService: NbDialogService) { }

  ngAfterViewInit() {
  }

  ngOnInit() {
    this.frankenplotService.checkServerStatus().subscribe(
      data => {
        this.showToast(NbToastStatus.SUCCESS, 'SUCCESS: Pro-bio', 'Server is running and all drives mounted to /nfs');
      },
        error => {
        this.showToast(NbToastStatus.DANGER, 'ERROR: Pro-bio', 'No  mount point found at /nfs');
          this.dialogService.open(ShowcaseDialogComponent, {
            context: {
              title: 'Error:',
            },
            closeOnBackdropClick: false,
          });
    });


    // initialize the plots
    /*for (const plot_name of this.plotnames) {
      this.frankenplotService.getFrankenPlots('PB-P-00356971-CFDNA-03589573-KH-C2', plot_name)
        .subscribe(data => {
            this.plot_data[plot_name] = data;
          } ,
            error => {
              console.log(error);
            });
    }*/
  }

  /* Edit buttons for germline and somatic*/
  edit(rowIndex: number) {
    this.editRow = rowIndex;
  }
  edit_somatic(rowIndex: number) {
    this.editRow_somatic = rowIndex;
  }
  update(variant_type) {
    if (variant_type === 'germline') {
      this.ngx_data_germline = [...this.ngx_data_germline.map((obj, index) => {
        if (index === this.editRow) {
          if ( this.gtag.nativeElement.value !== '') {
            this.save_germline_status = true;
            obj.TAG = this.gtag.nativeElement.value;
          }
          if ( this.gcall.nativeElement.value !== '') {
            this.save_germline_status = true;
            obj.CALL = this.gcall.nativeElement.value;
          }
          if ( this.notes_germline.nativeElement.value !== '') {
            this.save_germline_status = true;
            obj.NOTES = this.notes_germline.nativeElement.value;
          }
          return obj;
        }
        return obj;
      })];
      this.editRow = -1;
    }else {
      this.ngx_data_somatic = [...this.ngx_data_somatic.map((obj, index) => {
        if (index === this.editRow_somatic) {
          if (this.stag.nativeElement.value !== '') {
            this.save_somatic_status = true;
            obj.Tags = this.stag.nativeElement.value;
          }
          if (this.scall.nativeElement.value !== '') {
            this.save_somatic_status = true;
            obj.Call = this.scall.nativeElement.value;
          }
          if ( this.notes_somatic.nativeElement.value !== '') {
            this.save_germline_status = true;
            obj.Notes = this.notes_somatic.nativeElement.value;
          }
          return obj;
        }
        return obj;
      })];
      this.editRow_somatic = -1;
    }

  }

  public igv_load_session(session_type) {
    if (! this.igv_session_button_status) {
      this.showToast(NbToastStatus.WARNING, 'IGV:', 'Please wait IGV is loading.. ' + this.dataModel);
      return;
    }
    /*this.frankenplotService.igv_status().subscribe(data => {
      this.showToast(NbToastStatus.SUCCESS, 'IGV:', 'Is  ready..');
    }, error => {
      this.showToast(NbToastStatus.DANGER, 'IGV:', 'Please start IGV App.');
    });*/
    this.igv_session_button_status = false;
    this.frankenplotService.igv_session_load(this.project_dataModel, this.dataModel,
      this.capture_dataModel, session_type).subscribe(data => {
      this.showToast(NbToastStatus.SUCCESS, 'IGV:', 'IGV  session is ready: ' + this.dataModel);
      this.igv_session_button_status = true;
    }, error => {
      this.showToast(NbToastStatus.DANGER, 'IGV:', 'Error while loading IGV session file..');
      this.igv_session_button_status = true;
    });
  }
  public selectionChanged(event) {
    if ( ! this.dataModel) {
      return false;
    }
    this.options_capture = [];
    this.capture_dataModel = '';
    this.show_plots_panel = false;
    this.frankenplotService.getDropdownListCapture(this.project_dataModel, this.dataModel).subscribe(data => {
        this.options_capture = data['sample_capture'];
      },
      error => {
        this.showToast(NbToastStatus.DANGER, 'Pro-bio:', 'No Capture ID Found');
        this.options_capture = [];
      });
  }
  public selectionChangedProject(event) {
    if ( ! this.project_dataModel) {
      return false;
    }
    this.options = [];
    this.options_capture = [];
    this.dataModel = '';
    this.show_plots_panel = false;
    this.frankenplotService.getDropdownList(this.project_dataModel).subscribe(droplist => {
        this.options = droplist['sidis'];
        // this.checkIGVStatus();
      },
      error => {
        this.showToast(NbToastStatus.DANGER, 'ERROR: Pro-bio', 'No  mount point found at /nfs');
        this.dialogService.open(ShowcaseDialogComponent, {
          context: {
            title: 'Error:',
          },
          closeOnBackdropClick: false,
        });
      });
  }

  public selectionChangedCapture(event) {
    // get url for franken plots to submit in the ngx-viewer
    if ( ! this.capture_dataModel) {
      return false;
    }
    // load sv table data and its cloumn dynamically
    this.table_loading_error_data = {
      'structural_variants' : 'Loading...',
      'germline_variants' : 'Loading...',
      'somatic_variants' : 'Loading...',
    };
    if ( this.source.count() > 0) {
      this.source.empty();
    }
    this.columns = [];
    this.columns_germline = [];
    this.columns_somatic = [];
    this.ngx_data = [];
    this.ngx_data_germline = [];
    this.ngx_data_somatic = [];

    this.frankenplotService.get_sv_table(this.project_dataModel, this.dataModel, this.capture_dataModel)
      .subscribe(data => {
      // this.settings['columns'] = data['header'];
      // this.source.load(data['data']);
        this.columns = data['header'];
        this.ngx_data = data['data'];
    }, error => {
      this.showToast(NbToastStatus.DANGER, 'ERROR: Pro-bio',
        'Unable to get Structural Variant data');
      // this.source.load([]);
      // this.source.empty();
      // this.source.reset();
         this.table_loading_error_data['structural_variants'] = 'No Data Found For Structural Variants';
      });

    // load germline variants table data and its cloumn dynamically
    this.frankenplotService.get_igv_table('germline', this.project_dataModel,
      this.dataModel, this.capture_dataModel)
      .subscribe (
        data_germline => {

          for (const each_col of data_germline['header']) {
            if (each_col.key === 'TAG') {
              each_col.cellTemplate = this.germLineTag;
            }
            if ( each_col.key === 'CALL') {
              each_col.cellTemplate = this.germLineCall;
            }
            if ( each_col.key === 'NOTES') {
              each_col.cellTemplate = this.germLineNotes;
            }
          }
          // set action button
          this.columns_germline = [ { key: 'action', title: 'Actions', cellTemplate: this.actionTpl },
            ...data_germline['header'] ];
          // set tag and call drop downs

          this.ngx_data_germline = data_germline['data'];
          this.germline_variant_filename = data_germline['filename'];
          // check data
          // console.log(this.ngx_data_germline);
        }, error => {
        this.showToast(NbToastStatus.DANGER, 'ERROR: Pro-bio',
          'Unable to get Structural Variant data');
        // this.source_germline.load([]);
        // this.source_germline.empty();
        // this.source_germline.reset();
        this.table_loading_error_data['germline_variants'] = 'No Data Found For Germline Variants';
      });

    // load somatic variants table data and its cloumn dynamically
    this.frankenplotService.get_igv_table('somatic', this.project_dataModel,
      this.dataModel, this.capture_dataModel)
      .subscribe (
        data_somatic => {
          // set action button
          // this.columns_somatic =  data_somatic['header'];
          for (const each_col_somatic of data_somatic['header']) {
            if (each_col_somatic.key === 'Tags') {
              each_col_somatic.cellTemplate = this.somaticTag;
            }
            if ( each_col_somatic.key === 'Call') {
              each_col_somatic.cellTemplate = this.somaticCall;
            }
            if ( each_col_somatic.key === 'Notes') {
              each_col_somatic.cellTemplate = this.somaticNotes;
            }
          }
          this.columns_somatic = [ { key: 'action', title: 'Actions', cellTemplate: this.actionSomaticTpl },
            ...data_somatic['header'] ];
          this.ngx_data_somatic = data_somatic['data'];
          // this.source.setPaging(1, 100);
          // this.settings_somatic['columns'] = data_somatic['header'];
          // this.source_germline.load(data_somatic['data']);
          this.somatic_variant_filename = data_somatic['filename'];
          console.log("filename");
          console.log(this.somatic_variant_filename);

        }, error => {
          this.showToast(NbToastStatus.DANGER, 'ERROR: Pro-bio',
            'Unable to get Structural Variant data');
          // this.source_somatic.load([]);
          // this.source_somatic.empty();
          // this.source_somatic.reset();
          this.table_loading_error_data['somatic_variants'] = 'No Data Found For Somatic Variants';
        });


    this.frankenplotService.getFrankenPlotUrl(this.project_dataModel, this.dataModel, this.capture_dataModel)
      .subscribe(data => {
      this.franken_images_url_list = data['image_url'];
      this.show_plots_panel = true;

    }, error => {
      this.show_plots_panel = false;
      this.showToast(NbToastStatus.DANGER, 'ERROR: Pro-bio',
        'Unable to get franken plot urls check the backend server is running');
    });

    // get interactive plots
    this.frankenplotService.getFrankenInterativePlot(this.project_dataModel,
      this.dataModel, this.capture_dataModel, 'snpratio')
      .subscribe(data => {
        // data['plot_data'].layout.width = (window.innerWidth ) - (( window.innerWidth ) * (40 / 100));
        // data['plot_data'].layout.width = (screen.width ) - (( screen.width ) * (40 / 100));
        this.snpratio_height = data['plot_data'].layout.height;
        data['plot_data'].layout.xaxis.automargin = true;
        data['plot_data'].layout.xaxis.autorange = true;
        this.plot_data['snpratio'] = data['plot_data'];
        // data['plot_data']['layout']['xaxis']['range'][1] = 9750481;
        // extract gene from each list
        const regex: RegExp = /<br>gene:  (\w+) <br>/g;
        for (let i = 0; i < data['plot_data']['data'][1]['text'].length; i++ ) {
          const match_gene = regex.exec(data['plot_data']['data'][1]['text'][i]);
          if (match_gene !== null) {
            this.franken_gene_position[match_gene[1]] = data['plot_data']['data'][1]['x'][i];
            this.geneOptions.push(match_gene[1]);
          }
        }
        data['plot_data']['data'][2].type = 'scattergl';
        data['plot_data']['data'][3].type = 'scattergl';
        // split the plots
        this.plot_data['snpratio']['gene_plot'] = data['plot_data']['data'][1];
        this.plot_data['snpratio']['xaxis'] = data['plot_data'].layout.xaxis;
        this.plot_data['snpratio']['yaxis'] = data['plot_data'].layout.yaxis;
        this.load_snp_density_plot();
        // set igv
        /*igv.createBrowser(this.igvmyDiv.nativeElement, this.igv_options)
          .then( (browser) => {
            this.igvBrowser = browser;
            browser.loadTrackList([
              {
                name: 'bam',
                type: 'alignment',
                format: 'bam',
                url: '/api/flanken/igvfiles?sdid=1&capture_id=1&filename=1',
                indexURL: '/api/flanken/igvfiles?sdid=1&capture_id=1&filename=0'},
            ]);
          });*/

      }, error => {
        this.showToast(NbToastStatus.DANGER, 'ERROR: Pro-bio',
          'No Interactive Franken Plots Found');
      });


      this.plot_data = {};
    }


  load_snp_density_plot() {
    this.frankenplotService.getFrankenInterativePlot(this.project_dataModel,this.dataModel,
      this.capture_dataModel, 'snpratio_density')
      .subscribe(data_density => {
          // data_density['plot_data'].layout.width = window.innerWidth - 1600;
          // data_density['plot_data'].layout.height = ((window.innerHeight) - ((window.innerHeight)  * (50 / 100) ))
          data_density['plot_data'].layout.height = ((this.snpratio_height) - ((this.snpratio_height)  * (50 / 100) ));
          // ((screen.height) - ((screen.height)  * (52 / 100) ));
          this.plot_data['density'] = data_density['plot_data'];
        },
        error => {
          // console.log('No density plot');
          this.showToast(NbToastStatus.DANGER, 'ERROR: Pro-bio',
            'Unable to get franken Density plot...');
        });
  }

  relayout(event) {
    return true;
  }

  selectionChangedGene(event) {
    if ( this.geneDataModel) {
      const xrange = this.franken_gene_position[this.geneDataModel];
      // this.plot_data['snpratio']['layout'].width = '100%';
      this.plot_data['snpratio'].layout.xaxis =  this.plot_data['snpratio']['xaxis'];
      this.plot_data['snpratio'].layout.yaxis =  this.plot_data['snpratio']['yaxis'];
      this.plot_data['snpratio'].layout.xaxis.autorange = false;
      this.plot_data['snpratio'].layout.yaxis.autorange = false;
      this.plot_data['snpratio'].layout.xaxis.range =   [ xrange - 1000000 , xrange + 1000000];
      this.plot_data['snpratio'].layout.yaxis.range =   [ -1 , 1];
      this.franken_plot_revision ++;
    }
  }

  public onplotSelection(event) {
    // console.log(event);
    // console.log(this.plot_data['snpratio'].layout);
    return true;
  }

  public onPlotAnimate(event) {
    // console.log(event);
    return true;
  }

  private showToast(type: NbToastStatus, title: string, body: string) {
    const config = {
      status: type,
      destroyByClick: true,
      duration: 8000,
      hasIcon: true,
      position: NbGlobalPhysicalPosition.TOP_RIGHT,
      preventDuplicates: true,
    };
    const titleContent = title ? `. ${title}` : '';
    this.toastrService.show(
      body,
      `${titleContent}`,
      config);
  }
  public clickMe() {
    this.graph.layout.width = 520;
  }
  public saveIGVFile(variant_type) {
    const data = {};
    if (variant_type === 'germline') {
      data['file_name'] = this.germline_variant_filename;
      data['data'] = this.ngx_data_germline;
      this.save_germline_status = false;
    }
    if (variant_type === 'somatic') {
      data['file_name'] = this.somatic_variant_filename;
      data['data'] = this.ngx_data_somatic;
      this.save_somatic_status = false;
    }
    this.frankenplotService.igvnavFileSave(data).subscribe(success => {
      this.showToast(NbToastStatus.SUCCESS, 'ERROR: Pro-bio',
        'Successfully saved igvnav ' + variant_type + ' file');
    }, error => {
      this.showToast(NbToastStatus.DANGER, 'ERROR: Pro-bio',
        'Unable to save igvnav ' + variant_type + ' file');
    });
  }

  public  igv_goto_service(goto) {

    const url = 'http://127.0.0.1:60151/goto?locus=' + goto;
    console.log(url);
    this.frankenplotService.igv_locus_status(url).subscribe(data => {}, error => {});
  }

  public igv_goto_locus(event) {
    let chr = '';
    let current_key = '';

    if ('Start' in this.ngx_selected_row_data) {
      chr = 'Chromosome';
    }
    if ( 'START' in this.ngx_selected_row_data) {
      chr = 'CHROM';
    }
    if ('START_A' in this.ngx_selected_row_data) {
      chr = 'CHROM_A';
    }
    for ( const each_key of Object.keys(this.ngx_selected_row_data)){
      if (this.ngx_selected_row_data[each_key] ===  event.target.innerText) {
        current_key = each_key;
      }
    }
    if (current_key in {'START': '', 'END': '', 'Start': '', 'Stop': '', 'START_A': '', 'END_A': ''}) {
      let end = '';
      let start = '';
      if ( 'Start' in this.ngx_selected_row_data) {
        end = 'Stop';
        start = 'Start';
      }
      if ('START' in this.ngx_selected_row_data) {
        end = 'END';
        start = 'START';
      }
      if ('START_A' in this.ngx_selected_row_data ) {
        end = 'END_A';
        start = 'START_A';
      }
      this.igv_goto_service('chr' + this.ngx_selected_row_data[chr] + ':' +
        this.ngx_selected_row_data[start] + '-' + this.ngx_selected_row_data[end]);
    }
    if ( current_key === 'GENE') {
      this.igv_goto_service(this.ngx_selected_row_data[current_key]);
    }
    if ( current_key === 'GENE_A') {
      this.igv_goto_service(this.ngx_selected_row_data[current_key]);
    }

  }

  public igv_event_emitter(event) {
    this.ngx_selected_row_data = event.value.row;
  }


}
