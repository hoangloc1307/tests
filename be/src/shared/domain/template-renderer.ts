export interface TemplateRenderer {
  render(templateName: string, data?: Record<string, unknown>): string;
}
