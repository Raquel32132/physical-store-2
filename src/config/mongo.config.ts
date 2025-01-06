import { ConfigService } from "@nestjs/config";

export const getMongoConfig = async (configService: ConfigService) => ({
  uri: configService.get<string>('MONGO_URI'),
  useNewUrlParser: true,
  useUnifiedTopology: true,
})