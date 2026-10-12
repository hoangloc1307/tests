import fs from 'fs';
import Handlebars from 'handlebars';
import path from 'path';
import { injectable } from 'tsyringe';
import type { TemplateRenderer } from '~/shared/domain/template-renderer';

@injectable()
export class HandlebarsTemplateRenderer implements TemplateRenderer {
  private cache = new Map<string, HandlebarsTemplateDelegate>();

  render(templateName: string, data: Record<string, unknown> = {}): string {
    let template = this.cache.get(templateName);

    if (!template) {
      const templatePath = path.join(import.meta.dirname, 'templates', `${templateName}.hbs`);
      const templateContent = fs.readFileSync(templatePath, 'utf-8');
      template = Handlebars.compile(templateContent);
      this.cache.set(templateName, template);
    }

    return template(data);
  }
}
