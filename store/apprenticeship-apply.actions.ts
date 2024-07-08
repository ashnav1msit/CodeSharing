import {
  ApplicationDto,
  PaymentRequestDto,
} from '@aedigital/features/apprenticeship-wip-common/clients';

export namespace ApprenticeshipApplyActions {
  const AREA = '[Apprenticeship Apply]';

  export class SelectTrade {
    static readonly type = `${AREA} Select Trade`;
    constructor(
      public selectedTradeId: string,
      public selectedSubTradeId: string | null | undefined
    ) {}
  }

  export class GetApplications {
    static readonly type = `${AREA} Get Applications`;
    constructor() {}
  }

  export class NewApplication {
    static readonly type = `${AREA} New Application`;
    constructor(public selectedTradeId: string) {}
  }

  export class ContinueApplication {
    static readonly type = `${AREA} Continue Application`;
    constructor(public applicationId: string, public returnUrl: string) {}
  }

  export class RedirectToApplication {
    static readonly type = `${AREA} Redirect To Application`;
    constructor(public applicationId: string, public returnUrl: string) {}
  }

  export class UpdateApplication {
    static readonly type = `${AREA} Update Application`;
    constructor(public application: ApplicationDto) {}
  }

  export class RedirectToPayment {
    static readonly type = `${AREA} Redirect To Payment`;
    constructor(public application: ApplicationDto) {}
  }

  export class TryDeleteApplication {
    static readonly type = `${AREA} Try Delete Application`;
    constructor(public application: ApplicationDto) {}
  }

  export class DeleteApplication {
    static readonly type = `${AREA} Delete Application`;
    constructor(public applicationId: string) {}
  }

  export class SubmitApplication {
    static readonly type = `${AREA} Submit Application`;
    constructor(public application: ApplicationDto) {}
  }

  export class ProceedToPayment {
    static readonly type = `${AREA} Proceed To Payment`;
    constructor(public application: ApplicationDto) {}
  }

  export class SubmitPayment {
    static readonly type = `${AREA} Submit Payment`;
    constructor(public paymentRequest: PaymentRequestDto) {}
  }

  export class OpenAttachment {
    static readonly type = `${AREA} Open Attachment`;
    constructor(public fileId: string, public filename: string) {}
  }

  export class UploadAttachmentThenUpadate {
    static readonly type = `${AREA} Upload Attachment`;
    constructor(
      public application: ApplicationDto,
      public files: Array<Blob>,
      public attachmentType: number,
      public parentKey?: number
    ) {}
  }

  export class GetApplicationToUpdateSponsor {
    static readonly type = `${AREA} Get Application To Update Sponsor`;
    constructor(public applicationId: string) {}
  }

  export class OpenUpdateSponsorModal {
    static readonly type = `${AREA} Open Update Sponsor Modal`;
    constructor(public application: ApplicationDto) {}
  }

  export class UpdateSponsor {
    static readonly type = `${AREA} Update Sponsor`;
    constructor(public application: ApplicationDto) {}
  }
}
