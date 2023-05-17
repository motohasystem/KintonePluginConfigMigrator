export class ConfigMigrator {
    /**
     * コンストラクタ
     * @param {string} plugin_id プラグインID
     */
    constructor(plugin_id: string);
    LABEL_ITEM: string;
    LABEL_IMPORT_BUTTON: string;
    LABEL_EXPORT_BUTTON: string;
    HEADER_NODE_ID: string;
    ID_SUBMIT_BUTTON: string;
    /** @type {Record<string, string>} */
    store_config: Record<string, string>;
    plugin_id: string;
    /**
   * インポート・エクスポートフォームを配置します。
   * put_forms関数はプラグインIDを使用してエクスポートフォームを作成し、インポートフォームも作成します。
   * 要素を構築するUtils.buildElementを使用し、ヘッダーにラベルと要素を追加します。
   */
    put_forms(node_id: any): void;
    /**
     * インポートボタンを持つdiv要素を作成して返します。
     *
     * @return {HTMLDivElement} インポートボタンを持つdiv要素
     */
    compose_import_form(): HTMLDivElement;
    /**
     * インポートボタンを作成して返します。
     *
     * @return {HTMLInputElement} インポートボタンDIV要素
     */
    make_button_import(): HTMLInputElement;
    /**
   * ファイル選択イベントを受け取って、ファイル読み込みとJSONデータをプラグイン設定として保存する処理を行う
   * @param {Event} event - イベントオブジェクト
   */
    importSettings(event: Event): void;
    /**
   * 指定されたプラグインのIDを持つエクスポートリンクを生成し、ヘッダノードに追加します
   *
   * @param {string} [plugin_id] プラグインのID。省略時は this.plugin_id が使用される
   * @throws {Error} ヘッダノードが見つからない場合
   */
    put_export_link(plugin_id?: string): void;
    /**
   * plugin_idを受け取り、設定情報をJSON形式でダウンロードするボタンを生成します。
   * @param {String} plugin_id プラグインID
   * @return {HTMLDivElement} 生成されたHTML要素
   */
    compose_export_form(plugin_id: string): HTMLDivElement;
    /**
   * ダウンロードボタンを構築します。
   *
   * @param {Uint8Array} data - データ
   * @param {string} filename - ファイル名 (デフォルト: settings.txt)
   * @returns {HTMLDivElement} 構築したブロック要素
   */
    make_download_button(data: Uint8Array, filename?: string): HTMLDivElement;
}
