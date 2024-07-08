import { Action, State, StateContext } from '@ngxs/store';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Injectable, NgZone } from '@angular/core';
import { ApprenticeshipApplyStateModel } from './apprenticeship-apply-state.model';
import { ApprenticeshipApplyActions } from './apprenticeship-apply.actions';
import { catchError, finalize, map, tap, mergeMap } from 'rxjs/operators';
import { Navigate, RouterDataResolved } from '@ngxs/router-plugin';
import { UiActions, UiRouterStateParams } from '@aedigital/ui';
import {
  ApplicationDtoQueryResult,
  ApplicationService,
  SaveApplicationCommand,
  SubmitApplicationCommand,
  FilesService,
  AttachmentDto,
  ApplicationDtoIEnumerableQueryResult,
  MakePaymentCommand,
  PaymentService,
  TradeDto,
  ApplicationStatusType,
} from '@aedigital/features/apprenticeship-wip-common/clients';
import { deepCopy } from '@aedigital/utils';
import {
  Constants,
  TradeSelectors,
} from '@aedigital/features/apprenticeship-wip-common';
import { of } from 'rxjs';
import { Params } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import {
  UpdateSponsorComponent,
  UpdateSponsorResponse,
} from '../components/update-sponsor/update-sponsor.component';

const initialState = new ApprenticeshipApplyStateModel();

@State<ApprenticeshipApplyStateModel>({
  name: 'apprenticeship_apply',
  defaults: initialState,
})
@Injectable()
export class ApprenticeshipApplyState {
  constructor(
    private applicationService: ApplicationService,
    private filesService: FilesService,
    private paymentService: PaymentService,
    private ngZone: NgZone,
    private dialog: MatDialog
  ) {}

  @SelectSnapshot(TradeSelectors.getTrades)
  trades: Array<TradeDto>;

  @Action(ApprenticeshipApplyActions.SelectTrade)
  onSelectTrade(
    { dispatch, patchState }: StateContext<ApprenticeshipApplyStateModel>,
    action: ApprenticeshipApplyActions.SelectTrade
  ) {
    let selectedSubTradeId = action.selectedSubTradeId ?? '';

    const subTrades = (this.trades ?? []).filter(
      (c) => c.parentId === action.selectedTradeId
    );

    if (!selectedSubTradeId && subTrades.length === 1) {
      selectedSubTradeId = subTrades[0]?.id ?? '';
    }

    const params = {} as Params;
    params[Constants.Params.TradeId] = action.selectedTradeId;
    params[Constants.Params.SubTradeId] = selectedSubTradeId;

    patchState({
      selectedTradeId: action.selectedTradeId,
      selectedSubTradeId: selectedSubTradeId,
    });

    dispatch([new Navigate(['/application'], params)]);
  }

  @Action(RouterDataResolved)
  onRouterDataResolved(
    { patchState, dispatch }: StateContext<ApprenticeshipApplyStateModel>,
    { routerState }: RouterDataResolved<UiRouterStateParams>
  ) {
    const params = routerState.queryParams;
    if (params) {
      const selectedTradeId = params[Constants.Params.TradeId] || '';
      const selectedSubTradeId = params[Constants.Params.SubTradeId] || '';

      patchState({
        selectedTradeId: selectedTradeId,
        selectedSubTradeId: selectedSubTradeId,
      });

      dispatch(UiActions.CompleteWork);
    }
  }

  @Action(ApprenticeshipApplyActions.GetApplications)
  onGetApplications({
    patchState,
    dispatch,
  }: StateContext<ApprenticeshipApplyStateModel>) {
    dispatch(UiActions.BeginWork);
    return this.applicationService.apiApprenticeshipWipApplicationGet().pipe(
      tap((data: ApplicationDtoIEnumerableQueryResult) => {
        patchState({
          applications: data.model || [],
        });
        return dispatch(UiActions.CompleteWork);
      })
    );
  }

  @Action(ApprenticeshipApplyActions.TryDeleteApplication)
  onTryDeleteApplication(
    { dispatch }: StateContext<ApprenticeshipApplyStateModel>,
    action: ApprenticeshipApplyActions.TryDeleteApplication
  ) {
    dispatch(
      UiActions.Notification.largeWarning({
        title: 'Confirm application cancellation',
        items: [
          {
            propertyName: '',
            severity: '',
            message:
              'Are you sure that you want to cancel your application? This action will permantely cancel your application and delete any information collected.',
          },
        ],
        okActions: [
          new ApprenticeshipApplyActions.DeleteApplication(
            action.application?.id || ''
          ),
        ],
        okTitle: 'Cancel Application',
        cancelTitle: 'Back',
      })
    );
  }

  @Action(ApprenticeshipApplyActions.DeleteApplication)
  onDeleteApplication(
    { dispatch }: StateContext<ApprenticeshipApplyStateModel>,
    action: ApprenticeshipApplyActions.DeleteApplication
  ) {
    dispatch(UiActions.BeginWork);
    return this.applicationService
      .apiApprenticeshipWipApplicationIdDelete(action.applicationId)
      .pipe(
        tap((data: boolean) => {
          if (data) {
            dispatch([
              UiActions.Notification.smallSuccess({
                title: 'Successfully cancelled application',
              }),
              new ApprenticeshipApplyActions.GetApplications(),
            ]);
          } else {
            dispatch(
              UiActions.Notification.smallError({
                title: 'Unknown Error - Unable to cancel application',
              })
            );
          }
        }),
        catchError((err) => {
          const { errors, warnings } = extract(err);

          if (errors.length > 0) {
            return dispatch(
              UiActions.Notification.largeError({
                title: 'Unable to delete application',
                items: errors,
                okTitle: 'OK',
                cancelTitle: 'Cancel',
              })
            );
          }

          return dispatch(
            UiActions.Notification.largeWarning({
              title: 'Unable to delete application',
              items: warnings,
              okTitle: 'OK',
              cancelTitle: 'Cancel',
            })
          );
        }),
        finalize(() => {
          dispatch(UiActions.CompleteWork);
        })
      );
  }

  @Action(ApprenticeshipApplyActions.ContinueApplication)
  onContinueApplication(
    { dispatch, patchState }: StateContext<ApprenticeshipApplyStateModel>,
    action: ApprenticeshipApplyActions.ContinueApplication
  ) {
    dispatch(UiActions.BeginWork);
    patchState({
      selectedApplication: undefined,
    });
    return this.applicationService
      .apiApprenticeshipWipApplicationRefreshIdPost(action.applicationId)
      .pipe(
        tap((data: ApplicationDtoQueryResult) => {
          const application = data.model;

          if (data.canAccess && data.isFound && data.model) {
            patchState({
              selectedApplication: application,
            });
          } else {
            dispatch(
              UiActions.Notification.smallError({
                title: 'Unable to retrieve application',
              })
            );
          }
        }),
        finalize(() => {
          dispatch(UiActions.CompleteWork);
        })
      );
  }

  @Action(ApprenticeshipApplyActions.RedirectToApplication)
  onRedirectToApplication(
    { dispatch, patchState }: StateContext<ApprenticeshipApplyStateModel>,
    action: ApprenticeshipApplyActions.RedirectToApplication
  ) {
    dispatch(UiActions.BeginWork);
    patchState({
      selectedApplication: undefined,
    });
    const route =
      'application/' + action.applicationId + '/' + action.returnUrl;

    return dispatch(new Navigate([route]));
  }

  @Action(ApprenticeshipApplyActions.RedirectToPayment)
  onRedirectToPayment(
    { dispatch, patchState }: StateContext<ApprenticeshipApplyStateModel>,
    action: ApprenticeshipApplyActions.RedirectToPayment
  ) {
    dispatch(UiActions.BeginWork);
    patchState({
      selectedApplication: undefined,
    });
    dispatch(UiActions.CompleteWork);
    const route = 'payment/' + action.application.id;
    return dispatch(new Navigate([route]));
  }

  @Action(ApprenticeshipApplyActions.UpdateApplication)
  onUpdateApplication(
    { getState, dispatch }: StateContext<ApprenticeshipApplyStateModel>,
    action: ApprenticeshipApplyActions.UpdateApplication
  ) {
    if (
      action.application.applicationStatusTypeId ===
      ApplicationStatusType.InProgress
    ) {
      dispatch(UiActions.BeginWork);
      const state = getState();

      const saveApplicationCommand = {
        acceptedWarnings: true,
        application: {
          ...state.selectedApplication,
          ...action.application,
        },
      } as SaveApplicationCommand;
      return this.applicationService
        .apiApprenticeshipWipApplicationPost(saveApplicationCommand)
        .pipe(
          catchError((err) => {
            const { errors, warnings } = extract(err);

            if (errors.length > 0) {
              return dispatch(
                UiActions.Notification.largeError({
                  title: 'Unable to save application',
                  items: errors,
                  okTitle: 'OK',
                  cancelTitle: 'Cancel',
                })
              );
            }

            return dispatch(
              UiActions.Notification.largeWarning({
                title: 'Unable to save application',
                items: warnings,
                okTitle: 'OK',
                cancelTitle: 'Cancel',
              })
            );
          }),
          finalize(() => {
            return dispatch(UiActions.CompleteWork);
          })
        );
    }

    return of(true);
  }

  @Action(ApprenticeshipApplyActions.NewApplication)
  onNewApplication({
    dispatch,
    getState,
  }: StateContext<ApprenticeshipApplyStateModel>) {
    dispatch(UiActions.BeginWork);
    const state = getState();
    return this.applicationService
      .apiApprenticeshipWipApplicationPut({
        acceptedWarnings: true,
        tradeId: state.selectedSubTradeId,
      })
      .pipe(
        tap((data: string) => {
          if (data) {
            return dispatch([
              UiActions.Notification.smallSuccess({
                title: 'Successfully Started Application',
              }),
              new ApprenticeshipApplyActions.RedirectToApplication(
                data || '',
                ''
              ),
            ]);
          } else {
            return dispatch(
              UiActions.Notification.smallError({
                title: 'Unable to start application',
              })
            );
          }
        }),
        catchError((err) => {
          const { errors, warnings } = extract(err);

          if (errors.length > 0) {
            return dispatch(
              UiActions.Notification.largeError({
                title: 'Unable to start application',
                items: errors,
                okTitle: 'OK',
                cancelTitle: 'Cancel',
              })
            );
          }

          return dispatch(
            UiActions.Notification.largeWarning({
              title: 'Unable to start application',
              items: warnings,
              okTitle: 'OK',
              cancelTitle: 'Cancel',
            })
          );
        }),
        finalize(() => {
          return dispatch(UiActions.CompleteWork);
        })
      );
  }

  @Action(ApprenticeshipApplyActions.UploadAttachmentThenUpadate)
  onUploadAttachment(
    {
      patchState,
      getState,
      dispatch,
    }: StateContext<ApprenticeshipApplyStateModel>,
    action: ApprenticeshipApplyActions.UploadAttachmentThenUpadate
  ) {
    dispatch(UiActions.BeginWork);

    return this.ngZone.run(() => {
      const application = deepCopy(action.application);

      return this.filesService
        .apiApprenticeshipWipFilesPut(
          action.files,
          application.id || '',
          action.attachmentType,
          undefined,
          'body'
        )
        .pipe(
          tap((data: Array<AttachmentDto>) => {
            if (data) {
              switch (action.attachmentType) {
                case Constants.AttachmentTypes.EducationHistory: {
                  const highSchoolAttachments =
                    application?.educationHistory
                      ?.highSchoolRecordOfEducationReferences ||
                    new Array<AttachmentDto>();

                  data.forEach((attachment) => {
                    highSchoolAttachments.push(attachment);
                  });

                  if (
                    application?.educationHistory
                      ?.highSchoolRecordOfEducationReferences
                  ) {
                    application.educationHistory.highSchoolRecordOfEducationReferences =
                      deepCopy(highSchoolAttachments);
                  }

                  break;
                }

                case Constants.AttachmentTypes.JourneypersonCertificate: {
                  if (
                    action.parentKey !== null &&
                    action.parentKey !== undefined &&
                    application?.educationHistory?.journeypersonCertificates !==
                      null &&
                    application?.educationHistory?.journeypersonCertificates !==
                      undefined
                  ) {
                    const certificates =
                      application?.educationHistory?.journeypersonCertificates;
                    const certificate = certificates[action.parentKey];

                    const attachments =
                      certificate?.recordOfEducationReferences ||
                      new Array<AttachmentDto>();

                    data.forEach((attachment) => {
                      attachments.push(attachment);
                    });

                    application.educationHistory.journeypersonCertificates[
                      action.parentKey
                    ].recordOfEducationReferences = deepCopy(attachments);
                  } else {
                    dispatch(
                      UiActions.Notification.smallError({
                        title: 'Unknown Error - File not attached',
                      })
                    );
                  }

                  break;
                }

                case Constants.AttachmentTypes.OtherProgramsOrCourses: {
                  if (
                    action.parentKey !== null &&
                    action.parentKey !== undefined &&
                    application?.educationHistory?.otherProgramsOrCourses !==
                      null &&
                    application?.educationHistory?.otherProgramsOrCourses !==
                      undefined
                  ) {
                    const courses =
                      application?.educationHistory?.otherProgramsOrCourses;
                    const course = courses[action.parentKey];

                    const attachments =
                      course?.files || new Array<AttachmentDto>();

                    data.forEach((attachment) => {
                      attachments.push(attachment);
                    });

                    application.educationHistory.otherProgramsOrCourses[
                      action.parentKey
                    ].files = deepCopy(attachments);
                  } else {
                    dispatch(
                      UiActions.Notification.smallError({
                        title: 'Unknown Error - File not attached',
                      })
                    );
                  }

                  break;
                }

                default:
                  dispatch(
                    UiActions.Notification.smallError({
                      title: 'Unknown Error - Attachment type not supported',
                    })
                  );
              }

              patchState({ selectedApplication: application });

              dispatch(
                new ApprenticeshipApplyActions.UpdateApplication(application)
              );
            } else {
              dispatch(
                UiActions.Notification.smallError({
                  title: 'Unknown Error - Unable to upload file',
                })
              );
            }
          }),
          catchError((err) => {
            const { errors, warnings } = extract(err);

            if (errors.length > 0) {
              return dispatch(
                UiActions.Notification.largeError({
                  title: 'Unable to upload file',
                  items: errors,
                  okTitle: 'OK',
                  cancelTitle: 'Cancel',
                })
              );
            }

            return dispatch(
              UiActions.Notification.largeWarning({
                title: 'Unable to upload file',
                items: warnings,
                okTitle: 'OK',
                cancelTitle: 'Cancel',
              })
            );
          }),
          finalize(() => {
            dispatch(UiActions.CompleteWork);
          })
        );
    });
  }

  @Action(ApprenticeshipApplyActions.SubmitApplication)
  onSubmitApplication(
    { getState, dispatch }: StateContext<ApprenticeshipApplyStateModel>,
    action: ApprenticeshipApplyActions.SubmitApplication
  ) {
    dispatch(UiActions.BeginWork);
    const state = getState();
    const submitApplicationCommand = {
      acceptedWarnings: true,
      application: {
        ...state.selectedApplication,
        ...action.application,
      },
    } as SubmitApplicationCommand;

    return this.applicationService
      .apiApprenticeshipWipApplicationSubmitPost(submitApplicationCommand)
      .pipe(
        tap((data: boolean) => {
          if (data) {
            dispatch(UiActions.CompleteWork);
            const route = 'application-submit-confirmation/';
            dispatch(new Navigate([route]));
          } else {
            dispatch(
              UiActions.Notification.smallSuccess({
                title: 'Unknown Error - Unable to submit application',
              })
            );
          }
        }),
        catchError((err) => {
          const { errors, warnings } = extract(err);
          if (errors.length > 0) {
            return dispatch(
              UiActions.Notification.largeError({
                title: 'Unable to submit application',
                items: errors,
                okTitle: 'OK',
                cancelTitle: 'Cancel',
              })
            );
          }

          return dispatch(
            UiActions.Notification.largeWarning({
              title: 'Unable to submit application',
              items: warnings,
              okTitle: 'OK',
              cancelTitle: 'Cancel',
            })
          );
        }),
        finalize(() => {
          return dispatch(UiActions.CompleteWork);
        })
      );
  }

  // Proceed to payment
  @Action(ApprenticeshipApplyActions.ProceedToPayment)
  onProceedToPayment(
    { getState, dispatch }: StateContext<ApprenticeshipApplyStateModel>,
    action: ApprenticeshipApplyActions.ProceedToPayment
  ) {
    dispatch(UiActions.BeginWork);
    const state = getState();
    const submitApplicationCommand = {
      acceptedWarnings: true,
      application: {
        ...state.selectedApplication,
        ...action.application,
      },
    } as SubmitApplicationCommand;
    return this.applicationService
      .apiApprenticeshipWipApplicationSubmitPost(submitApplicationCommand)
      .pipe(
        tap((data: boolean) => {
          if (data) {
            // Redirect to payment screen for payment steps
            dispatch(UiActions.CompleteWork);
            const route = 'payment/' + action.application.id;
            dispatch(new Navigate([route]));
          } else {
            dispatch(
              UiActions.Notification.smallSuccess({
                title: 'Unknown Error - Unable to proceed to payment',
              })
            );
          }
        }),
        catchError((err) => {
          const { errors, warnings } = extract(err);
          if (errors.length > 0) {
            return dispatch(
              UiActions.Notification.largeError({
                title: 'Unable to proceed to payment',
                items: errors,
                okTitle: 'OK',
                cancelTitle: 'Cancel',
              })
            );
          }

          return dispatch(
            UiActions.Notification.largeWarning({
              title: 'Unable to proceed to payment',
              items: warnings,
              okTitle: 'OK',
              cancelTitle: 'Cancel',
            })
          );
        }),
        finalize(() => {
          return dispatch(UiActions.CompleteWork);
        })
      );
  }

  @Action(ApprenticeshipApplyActions.SubmitPayment)
  onSubmitPayment(
    { getState, dispatch }: StateContext<any>,
    action: ApprenticeshipApplyActions.SubmitPayment
  ) {
    dispatch(UiActions.BeginWork);

    const state = getState();

    const makePaymentCommand: MakePaymentCommand = {
      acceptedWarnings: true,
      applicationId: state.selectedApplication.id,
      paymentRequest: action.paymentRequest,
      isByOwner: true,
    };

    return this.paymentService
      .apiApprenticeshipWipPaymentPost(makePaymentCommand)
      .pipe(
        tap((data: boolean) => {
          if (data) {
            dispatch(
              UiActions.Notification.smallSuccess({
                title: 'Payment submitted successfully',
              })
            );
            const type = makePaymentCommand.paymentRequest?.isPayingInPerson
              ? 'inperson'
              : 'complete';
            const route = `payment-confirmation/${type}`;

            dispatch(new Navigate([route]));
          } else {
            dispatch(
              UiActions.Notification.largeError({
                title: 'Declined please try again',
              })
            );
          }
        }),
        catchError((err) => {
          const { errors, warnings } = extract(err);
          if (errors.length > 0) {
            return dispatch(
              UiActions.Notification.largeError({
                title: 'Unable to submit payment',
                items: errors,
                okTitle: 'OK',
                cancelTitle: 'Cancel',
              })
            );
          }

          return dispatch(
            UiActions.Notification.largeWarning({
              title: 'Unable to submit payment',
              items: warnings,
              okTitle: 'OK',
              cancelTitle: 'Cancel',
            })
          );
        }),
        finalize(() => {
          return dispatch(UiActions.CompleteWork);
        })
      );
  }

  @Action(ApprenticeshipApplyActions.OpenAttachment)
  onOpenAttachment(
    { dispatch, getState }: StateContext<ApprenticeshipApplyStateModel>,
    action: ApprenticeshipApplyActions.OpenAttachment
  ) {
    dispatch(UiActions.BeginWork);
    const state = getState();

    return this.filesService
      .apiApprenticeshipWipFilesGet(
        state.selectedApplication.id ? state.selectedApplication.id : '',
        action.fileId,
        action.filename
      )
      .pipe(
        map((data: any) => {
          const binaryData = [];
          binaryData.push(data);
          const binary = new Blob(binaryData, {
            type: data.type,
          });

          const url = window.URL.createObjectURL(binary);
          const anchor = document.createElement('a');

          anchor.href = url;
          anchor.target = '_blank';
          document.body.appendChild(anchor);
          anchor.click();
        }),
        catchError((err) => {
          const { errors, warnings } = extract(err);

          if (errors.length > 0) {
            return dispatch(
              UiActions.Notification.largeError({
                title: 'Unable to open file',
                items: errors,
                okTitle: 'OK',
                cancelTitle: 'Cancel',
              })
            );
          }

          return dispatch(
            UiActions.Notification.largeWarning({
              title: 'Unable to open file',
              items: warnings,
              okTitle: 'OK',
              cancelTitle: 'Cancel',
            })
          );
        }),
        finalize(() => {
          dispatch(UiActions.CompleteWork);
        })
      );
  }

  @Action(ApprenticeshipApplyActions.GetApplicationToUpdateSponsor)
  GetApplicationToUpdateSponsor(
    { dispatch, getState }: StateContext<ApprenticeshipApplyStateModel>,
    action: ApprenticeshipApplyActions.GetApplicationToUpdateSponsor
  ) {
    const applicationId = action.applicationId;
    if (applicationId !== '' || applicationId) {
      const application = dispatch([
        new ApprenticeshipApplyActions.ContinueApplication(applicationId, ''),
      ]);

      return application.pipe(
        map(() => {
          const state = getState();
          return state;
        }),
        mergeMap(async (state) =>
          state.selectedApplication.applicationStatusTypeId ===
          ApplicationStatusType.PendingSponsorConfirmation
            ? dispatch([
                new ApprenticeshipApplyActions.OpenUpdateSponsorModal(
                  state.selectedApplication
                ),
              ])
            : null
        )
      );
    }

    return null;
  }

  @Action(ApprenticeshipApplyActions.OpenUpdateSponsorModal)
  onOpenUpdateSponsorModal(
    { dispatch }: StateContext<ApprenticeshipApplyStateModel>,
    action: ApprenticeshipApplyActions.OpenUpdateSponsorModal
  ) {
    const dialogRef = this.dialog.open(UpdateSponsorComponent, {
      data: {
        sponsorContact: action.application.sponsorInformation?.sponsorContact,
      },
    });
    dialogRef.afterClosed().subscribe((response: UpdateSponsorResponse) => {
      if (response) {
        const application = deepCopy(action.application);
        if (application.sponsorInformation) {
          application.sponsorInformation.sponsorContact =
            response.sponsorContact;

          return dispatch([
            new ApprenticeshipApplyActions.UpdateSponsor(application),
          ]);
        }
      }

      return null;
    });
  }

  @Action(ApprenticeshipApplyActions.UpdateSponsor)
  onUpdateSponsor(
    { getState, dispatch }: StateContext<ApprenticeshipApplyStateModel>,
    action: ApprenticeshipApplyActions.UpdateSponsor
  ) {
    dispatch(UiActions.BeginWork);
    const state = getState();
    const submitApplicationCommand = {
      acceptedWarnings: true,
      application: {
        ...state.selectedApplication,
        ...action.application,
      },
    } as SubmitApplicationCommand;

    return this.applicationService
      .apiApprenticeshipWipApplicationSubmitPost(submitApplicationCommand)
      .pipe(
        tap((data: boolean) => {
          if (data) {
            dispatch([
              UiActions.Notification.smallSuccess({
                title: 'Sponsor updated successfully',
              }),
              new ApprenticeshipApplyActions.GetApplications(),
            ]);
          } else {
            dispatch(
              UiActions.Notification.smallError({
                title: 'Unknown Error - Unable to update sponsor',
              })
            );
          }
        }),
        catchError((err) => {
          const { errors, warnings } = extract(err);
          if (errors.length > 0) {
            return dispatch(
              UiActions.Notification.largeError({
                title: 'Unable to update sponsor',
                items: errors,
                okTitle: 'OK',
                cancelTitle: 'Cancel',
              })
            );
          }

          return dispatch(
            UiActions.Notification.largeWarning({
              title: 'Unable to update sponsor',
              items: warnings,
              okTitle: 'OK',
              cancelTitle: 'Cancel',
            })
          );
        }),
        finalize(() => {
          return dispatch(UiActions.CompleteWork);
        })
      );
  }
}
export function extract(err: any) {
  let errors = [];
  let warnings = [];
  if (err.status === 400 && err.error) {
    errors = err.error.filter((c: any) => c.severity === 'Error');
    warnings = err.error.filter((c: any) => c.severity === 'Warning');
  }
  return { errors, warnings };
}
