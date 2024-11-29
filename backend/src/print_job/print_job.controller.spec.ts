import { Test, TestingModule } from '@nestjs/testing';
import { PrintJobController } from './print_job.controller';

describe('PrintJobController', () => {
  let controller: PrintJobController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrintJobController],
    }).compile();

    controller = module.get<PrintJobController>(PrintJobController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
