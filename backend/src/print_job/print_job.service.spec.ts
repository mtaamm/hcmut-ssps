import { Test, TestingModule } from '@nestjs/testing';
import { PrintJobService } from './print_job.service';

describe('PrintJobService', () => {
  let service: PrintJobService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrintJobService],
    }).compile();

    service = module.get<PrintJobService>(PrintJobService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
