# deckgl-3dmap-maplibre
deck.gl を用いて国土地理院のデータを 3D 風に表示する試行

以下のレポジトリをベースに、最新の deck.gl (v9)、MapLibre GL JS (v5)等、最新版を利用し、国土地理院最適化ベクトルタイル（PMTiles）の三次元風の表現を行ったサイト。

https://github.com/mghs15/deckgl_3dseamlessmap

（関連ブログ：https://qiita.com/mg_kudo/items/6079ac10b7994e391228 ）

ライブラリの最新化の他、[既存のレポジトリ](https://github.com/mghs15/deckgl_3dseamlessmap)と比較し、以下の点を改良
* 等高線データに対して、turf.js の `simplify()` を利用して頂点数を削減することで、品質を犠牲にパフォーマンスを向上
* ZL15 に限らず、どの ZL でもデータを取得できるように変更
* 高さの強調機能を実装
* 等高線データだけではなく、標高タイルを用いた実装も追加
  * 標高タイルを用いる実装の場合、データ構造を GeoJSON に準じたものへ変更

## デモサイト
* 標高の取得に等高線を用いたもの
  https://mghs15.github.io/deckgl-3dmap-maplibre/contour-base/
* 標高の取得に標高タイルを用いたもの
  https://mghs15.github.io/deckgl-3dmap-maplibre/demtile-base/
  
## 特記点

deck.gl v9 で Mapbox/MapLibre と統合して利用する場合、利用方法が v8 と異なっていたので、以下、使用方法をメモ。

HTML には以下の通り記載
```
<!-- deck.gl -->
<script src="https://unpkg.com/deck.gl@^9.0.0/dist.min.js"></script>
<!-- MapLibre -->
<script src="https://unpkg.com/maplibre-gl@5.0.0/dist/maplibre-gl.js"></script>
<link href="https://unpkg.com/maplibre-gl@5.0.0/dist/maplibre-gl.css" rel='stylesheet' />
```

レイヤを追加する実装の際は以下の通り
```
const g = {}; // deck.gl 由来の情報を格納するためのグローバル変数
g.deckOverlay = new deck.MapboxOverlay({
    interleaved: true, layers: []
});

const myDeckLayer = new deck.PathLayer({
    id: 'my-deck-layer-id,
    data: data,
    pickable: true,
    widthScale: 1,
    widthMinPixels: 1,
    getPath: d => d.path.,
    getColor: d => [200,160,60],
    getWidth: d => 2
});

g.deckOverlay.setProps({
    layers: [
      myeDckLayer,
      // ...
    ]
  });
map.addControl(g.deckOverlay);
```

特に、deck.gl 由来のレイヤを削除するためには、以下のようなコードが必要
```
if(g.deckOverlay){
    map.removeControl(g.deckOverlay);
    delete g.deckOverlay;
}
```

## 参考資料・使用データ

* 国土地理院最適化ベクトルタイル https://github.com/gsi-cyberjapan/optimal_bvmap
* 国土地理院標高タイル https://maps.gsi.go.jp/development/demtile.html
* deck.gl https://deck.gl/
  * 特に https://github.com/visgl/deck.gl/blob/9.0-release/docs/api-reference/mapbox/mapbox-overlay.md
* MapLibre GL JS https://github.com/maplibre/maplibre-gl-js
* turf.js https://turfjs.org/
* PMTiles https://github.com/protomaps/PMTiles/tree/main/js
* https://github.com/shiwaku/gsi-vt-railtrcl-3d-maplibre
* その他、ChatGPT の支援を受けた
