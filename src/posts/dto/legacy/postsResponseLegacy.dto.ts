import { Exclude, Expose } from 'class-transformer';

export class PostsResponseLegacyDto {
  id: number;
  title: string;
  authorId: number;
  scheduledDate: Date | null;

  @Exclude({
    toPlainOnly: true,
  })
  paragraphs: string[];

  @Expose()
  get content() {
    return this.paragraphs.join('\n');
  }
}
