// import { Utils } from "commonutils"
import { Button } from 'kintone-ui-component/lib/button'
import { Utils} from 'kintoneplugin-commonutils'

export class ConfigMigrator {
    LABEL_ITEM = '📁 プラグイン設定を保存・復元します'
    LABEL_IMPORT_BUTTON = '⬆️設定をアップロード（復元）'
    LABEL_EXPORT_BUTTON = '⬇️設定をダウンロード（保存）'
    HEADER_NODE_ID = "KINTANLAB-SETTING-IMPORTER"
    ID_SUBMIT_BUTTON = 'button-load-settings'
    DEFAULT_CONFIG_KEY = 'config'

    /** @type {Record<string, string>} */
    store_config = {}


    /**
     * kintoneのプラグインIDを指定して初期化します。
     * 設定保存時のキーも指定できますが将来の変更に備えてのものなので、通常はデフォルトの'config'を使用してください。
     * @param {string} plugin_id プラグインID
     * @param {string} config_key kintone.plugin.app.getConfig(plugin_id) で取得する辞書のキー(通常はdefaultの'config'でよい)
     */
    constructor(plugin_id, config_key = 'config') {
        this.plugin_id = plugin_id
        this.config_key = config_key
    }

    /**
     * インポート・エクスポートフォームを配置します。
     * put_forms関数はプラグインIDを使用してエクスポートフォームを作成し、インポートフォームも作成します。
     * 要素を構築するUtils.buildElementを使用し、ヘッダーにラベルと要素を追加します。
     * @param {string} node_id フォームを配置したいHTML要素のIDを指定してください。
     * @returns 
     */
    put_forms(node_id) {
        if(node_id == undefined){
            node_id = this.HEADER_NODE_ID
        }
        const form_export = this.compose_export_form(this.plugin_id)
        const form_import = this.compose_import_form()

        const forms = Utils.buildElement({
            tagName: 'div'
            , className: 'container_import_export'
            , childElements: [
                form_export
                , form_import
            ]
        })

        const label = Utils.buildElement({
            tagName: 'div'
            , textContent: this.LABEL_ITEM
        })
        const header = Utils.ce('div', '', [label])

        const node_header = document.getElementById(node_id)
        if (node_header == null) {
            return
        }
        node_header.appendChild(
            Utils.ce('div', 'mt-3 mb-3', [
                header
                , forms
            ])
        )

    }

    /**
     * インポートボタンを持つdiv要素を作成して返します。
     * 
     * @return {HTMLDivElement} インポートボタンを持つdiv要素
     */
    compose_import_form  () {
        const button_import = this.make_button_import()

        return Utils.buildElement({
            tagName: 'div'
            , className: 'import_form_block'
            , childElements: [
                button_import
            ]
            , attrs: {
                'style': 'margin-top: 1em;'
            }
        })
    }

    /**
     * インポートボタンを作成して返します。
     * 
     * @return {HTMLInputElement} インポートボタンDIV要素
     */
    make_button_import() {
        const btn_import = new Button({
            'text': this.LABEL_IMPORT_BUTTON
            , 'type': 'submit'
            , 'id': this.ID_SUBMIT_BUTTON
        })

        const file_input = Utils.buildElement({
            tagName: 'input'
            , attrs: {
                type: 'file'
                , id: 'fileInput'
                , value: this.LABEL_IMPORT_BUTTON
            }
        })


        // インポートボタンのclickイベント
        // eslint-disable-next-line no-unused-vars
        btn_import.addEventListener('click', (_event) => {
            file_input.click();
        })

        // ファイル選択フォームのchange（ファイル選択）イベント
        file_input.addEventListener('change', (event) => {
            this.importSettings(event)
        })

        return btn_import
    }

    /**
   * ファイル選択イベントを受け取って、ファイル読み込みとJSONデータをプラグイン設定として保存する処理を行う
   * @param {Event} event - イベントオブジェクト
   */
    importSettings(event) {
        if (event == null || event.target == null) {
            return
        }
        // @ts-ignore
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                if (event.target == null) {
                    throw new Error('event.targetにnullが返りました。')
                }
                if (typeof event.target.result != 'string') {
                    throw new Error('event.target.result が文字列型ではありませんでした。')
                }
                const jsonData = JSON.parse(event.target.result);
                console.log({jsonData});
                
                // JSONデータを変数に読み込んだ後の処理をここで実行
                this.store_config = ((json) => {
                    const store = {}
                    store[this.config_key] = JSON.stringify(json)
                    return store
                })(jsonData)

                console.log(this.store_config)

                // 最終確認ダイアログと読み込みの実行
                const msg = '現在の設定を上書きして、読み込んだ設定を保存します。よろしいですか？'
                if (confirm(msg)) {
                    kintone.plugin.app.setConfig(this.store_config, function () {
                        alert('🆙 プラグイン設定を保存しました。アプリの更新をお忘れなく！');
                        window.location.href = '../../flow?app=' + kintone.app.getId();
                    });
                }


            } catch (error) {
                console.error('ファイルの読み込みに失敗しました:', error);
            }
        };

        reader.readAsText(file);
    }

    /**
   * 指定されたプラグインのIDを持つエクスポートリンクを生成し、ヘッダノードに追加します
   * 
   * @param {string} [plugin_id] プラグインのID。省略時は this.plugin_id が使用される
   * @throws {Error} ヘッダノードが見つからない場合
   */
    put_export_link(plugin_id) {
        if (plugin_id == undefined) {
            plugin_id = this.plugin_id
        }

        // 設定のロード
        const btn_link = this.compose_export_form(plugin_id)
        const node_header = document.getElementById(this.HEADER_NODE_ID)
        if (node_header == null) {
            throw new Error(`ノード #${this.HEADER_NODE_ID} が見つかりませんでした。`)
        }
        node_header.appendChild(btn_link)
    }

    /**
   * plugin_idを受け取り、設定情報をJSON形式でダウンロードするボタンを生成します。
   * @param {String} plugin_id プラグインID
   * @return {HTMLDivElement} 生成されたHTML要素
   */
    compose_export_form(plugin_id) {
        const CONF = kintone.plugin.app.getConfig(plugin_id);
        const config_body = CONF[this.config_key]

        console.log(this.config_key)
        console.log({config_body})

        const btn_link = this.make_download_button(config_body, 'setting.json')
        const form = Utils.ce('div', 'export_button_block', [btn_link], '', {
            'style': 'float: left; margin-right: 1em;'
        })
        return form
    }

    /**
   * ダウンロードボタンを構築します。
   * 
   * @param {Uint8Array} data - データ
   * @param {string} filename - ファイル名 (デフォルト: settings.txt)
   * @returns {HTMLDivElement} 構築したブロック要素
   */
    make_download_button(data, filename = 'settings.txt') {
        const bom = new Uint8Array([0xEF, 0xBB, 0xBF]); // add BOM
        const blob = new Blob([bom, data], { type: "octet/stream" })

        const anchor = Utils.buildElement({
            tagName: 'a'
            , attrs: {
                href: window.URL.createObjectURL(blob)
                , download: filename
                , role: 'button'
            }
        })

        // エクスポートボタン
        const button = new Button({
            'text': this.LABEL_EXPORT_BUTTON
            , 'type': 'normal'
        })

        // クリックイベント
        button.addEventListener('click', (event) => {
            console.log(event);
            anchor.click();
        })

        const block = Utils.ce('div', '', [button])
        return block
    }

}
