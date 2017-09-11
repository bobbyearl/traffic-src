export class Utils {
  public static registerScript(url: string): Promise<any> {
    return new Promise<any>((resolve: any, reject: any) => {
      const scriptEl = document.createElement('script');

      scriptEl.onload = resolve;
      scriptEl.onerror = reject;

      scriptEl.src = url;

      document.body.appendChild(scriptEl);
    });
  }
}
