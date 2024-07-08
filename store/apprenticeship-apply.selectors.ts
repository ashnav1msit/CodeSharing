import {
  ApplicationDto,
  ManageApplicationDto,
} from '@aedigital/features/apprenticeship-wip-common/clients';
import { Selector } from '@ngxs/store';
import { ApprenticeshipApplyStateModel } from './apprenticeship-apply-state.model';
import { ApprenticeshipApplyState } from './apprenticeship-apply.state';

export class ApprenticeshipApplySelectors {
  @Selector([ApprenticeshipApplyState])
  static getSelectedApplication(
    state: ApprenticeshipApplyStateModel
  ): ApplicationDto {
    return state.selectedApplication;
  }

  @Selector([ApprenticeshipApplyState])
  static getSelectedTradeId(state: ApprenticeshipApplyStateModel): string {
    return state.selectedTradeId;
  }

  @Selector([ApprenticeshipApplyState])
  static getSelectedSubTradeId(
    state: ApprenticeshipApplyStateModel
  ): string | null | undefined {
    return state.selectedSubTradeId;
  }

  @Selector([ApprenticeshipApplyState])
  static getApplications(
    state: ApprenticeshipApplyStateModel
  ): Array<ManageApplicationDto> {
    return state.applications;
  }
}
