import {
  ApplicationDto,
  ManageApplicationDto,
  TradeDto,
} from '@aedigital/features/apprenticeship-wip-common/clients';

export class ApprenticeshipApplyStateModel {
  selectedTradeId: string;
  selectedSubTradeId: string | null | undefined;
  applications: Array<ManageApplicationDto>;
  selectedApplication: ApplicationDto;
  trades: Array<TradeDto>;
  subTrades: Array<TradeDto>;
}
