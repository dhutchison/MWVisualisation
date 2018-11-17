import { DataAccessModule } from './data-access.module';

describe('DataAccessModule', () => {
  let dataModule: DataAccessModule;

  beforeEach(() => {
    dataModule = new DataAccessModule();
  });

  it('should create an instance', () => {
    expect(dataModule).toBeTruthy();
  });
});
