import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardComponent } from '../../components/card/card.component';
import { SummaryComponent } from './summary.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AbGovFormsModule } from '../../abgov-forms.module';
import { createFieldComponent } from '@ngx-formly/core/testing';
import { FieldConfig } from '../../models/Types';

const renderComponent = (field: FieldConfig) => {
  return createFieldComponent(field, {
    imports: [AbGovFormsModule, RouterTestingModule],
  });
};


// todo: Should write more extensive tests
describe('SummaryComponent', () => {
  it('should create', () => {
    const component = renderComponent({ type: "summary" });
    expect(component).toBeTruthy();
  });
});

