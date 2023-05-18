KintonePluginConfigMigrator
====

本ライブラリを利用することで、kintoneプラグインの設定をJSON形式で保存し、バックアップを取ったり、異なる環境へ楽に移行することができます。

設定をエクスポートしてバックアップを作成したり、異なる環境間で設定を簡単に共有する機能を提供します。また、インポート機能を利用すれば、他の環境に設定を即座に適用することができます。


# 使い方

## kintoneプラグインへの適用方法

```javascript
import { ConfigMigrator } from "kintoneplugin-config-migrator";

(function (PLUGIN_ID: string | undefined) {
    // メイン処理
    // ...

    // ConfigMigratorの初期化とボタンの設置
    const migrator = new ConfigMigrator(PLUGIN_ID)
    migrator.put_forms('config_body')
})(kintone.$PLUGIN_ID);
```

kintoneプラグインのメイン処理の中で呼び出せます。コンストラクタに与えるPLUGIN_IDはkintoneプラグインの初期化時に得られる情報を与えてください。

put_forms('config_body')ではインポート/エクスポートボタンを配置します。引数に渡したHTML要素IDにappendChild()する形でボタンを持ったHTML要素を配置します。

# プラグイン設定の取得について

kintone APIを使ってファイル保存、ファイル読み込みをしています。特に複雑なことはしていません。

## エクスポートの処理

kitnone plugin APIのgetConfig()を使って取得した設定をそのままダウンロードしています。

```javascript
const CONF = kintone.plugin.app.getConfig(plugin_id);
const config_body = CONF['config']
```

## インポートの処理

同じくkintone plugin APIのsetConfig()でアップロードしたjsonをそのまま格納しています。

```javascript
store['config'] = JSON.stringify(json)
kintone.plugin.app.setConfig(store, function () {
    alert('プラグイン設定を保存しました。');
    window.location.href = '../../flow?app=' + kintone.app.getId();
});
```


# License

このライブラリはMITライセンスの元で公開しています。
This plugin is licensed under MIT license.

Copyright (c) 2023 Daisuke Motohashi
https://opensource.org/licenses/MIT

# このライブラリについて

このライブラリは株式会社モノサスの[キン担ラボ](https://www.monosus.co.jp/service/kintanlab/)活動の一環として作成しました。
