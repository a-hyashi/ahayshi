/*
---
name: 208_ヘッダーセット（中央）
tag:
  - header
category:
  - 11.枠/208_ヘッダーセット（中央）
---

### ヘッダーセットの背景色の違いによるスタイルの設定（IS-066）

ヘッダーセット（バリエーション２）で、背景色が#FFFになるため、以下のように見た目を変更している。

バリエーション１
- 誘導バナーのboder:青緑
- 背景色：濃い水色

バリエーション２
- 文字色：リンクの文字色：白
- 矢印アイコン：白
- バナーの背景色・影部分：灰色

#### ヘッダーセットのバリエーションが２のとき

バリエーション１
- 誘導バナーのboder:#18849a
- 背景色：#35a0b6

```html
<div>
  <div class="t0-b-headerSingle-bPlacer">
    <header class="t0-b-headerSingle">
      <span>
        <span>
          <span></span>
        </span>
      </span>
      <div class="t0-b-headerSingle__hd">
        <span>
          <span>
            <span></span>
          </span>
        </span>
        <p>リンク無し
          <br>
          <a href="/">リンク有り</a>
        </p>
      </div>
      <div class="t0-b-headerSingle__bd">
        <div>
          <span>
            <span>
              <span></span>
            </span>
          </span>
          <div class="t0-b-headerSingle__col">
            <span>
              <span>
                <span></span>
              </span>
            </span>
            <div class="outerHtml">
              <div>
                <div class="t0-b-headerUnit-siteTitle-bPlacer">
                  <div class="t0-b-headerUnit-siteTitle">
                    <div class="t0-b-headerUnit-siteTitle__bd">
                      <div class="t0-b-headerUnit-siteTitle__bd-logo" data-switchable-key="contents.0.useLogo">
                        <img src="https://placehold.jp/400x160.png">
                      </div>
                      <div class="t0-b-headerUnit-siteTitle__bd-textCol">
                        <p class="t0-b-headerUnit-siteTitle__bd-note" data-switchable-key="contents.0.useUpperCaption">地元で30年！地域密着型リフォーム専門店</p>
                        <div class="t0-b-headerUnit-siteTitle__bd-siteName">
                          <p>リンク無し</p>
                        </div>
                      </div>
                    </div>
                    <p class="t0-b-headerUnit-siteTitle__ft" data-switchable-key="contents.0.useLowerCaption">〒000-0000 東京都千代田区大手町1-9-1</p>
                  </div>
                </div>
              </div>
              <div>
                <div class="t0-b-headerUnit-siteTitle-bPlacer">
                  <div class="t0-b-headerUnit-siteTitle">
                    <a href="/15331956201035" target="">
                      <div class="t0-b-headerUnit-siteTitle__bd">
                        <div class="t0-b-headerUnit-siteTitle__bd-logo" data-switchable-key="contents.0.useLogo">
                          <img src="https://placehold.jp/400x160.png">
                        </div>
                        <div class="t0-b-headerUnit-siteTitle__bd-textCol">
                          <p class="t0-b-headerUnit-siteTitle__bd-note" data-switchable-key="contents.0.useUpperCaption">地元で30年！地域密着型リフォーム専門店</p>
                          <div class="t0-b-headerUnit-siteTitle__bd-siteName">
                            <p>リンク有り</p>
                          </div>
                        </div>
                      </div>
                    </a>
                    <p class="t0-b-headerUnit-siteTitle__ft" data-switchable-key="contents.0.useLowerCaption">〒000-0000 東京都千代田区大手町1-9-1</p>
                  </div>
                </div>
              </div>
              <div>
                <div class="t0-b-headerUnit-siteTitle2-bPlacer">
                  <div class="t0-b-headerUnit-siteTitle2">
                    <div class="t0-b-headerUnit-siteTitle2__bd">
                      <div class="t0-b-headerUnit-siteTitle2__bd-logo" data-switchable-key="contents.0.useLogo">
                        <img src="https://placehold.jp/400x160.png">
                      </div>
                      <div class="t0-b-headerUnit-siteTitle2__bd-textCol">
                        <p class="t0-b-headerUnit-siteTitle2__bd-note" data-switchable-key="contents.0.useUpperCaption">地元で30年！地域密着型リフォーム専門店</p>
                        <div class="t0-b-headerUnit-siteTitle2__bd-siteName">
                          <p>リンク無し</p>
                        </div>
                      </div>
                    </div>
                    <p class="t0-b-headerUnit-siteTitle2__ft" data-switchable-key="contents.0.useLowerCaption">〒000-0000 東京都千代田区大手町1-9-1</p>
                  </div>
                </div>
              </div>
              <div>
                <div class="t0-b-headerUnit-siteTitle2-bPlacer">
                  <div class="t0-b-headerUnit-siteTitle2">
                    <a href="/15331956201035" target="">
                      <div class="t0-b-headerUnit-siteTitle2__bd">
                        <div class="t0-b-headerUnit-siteTitle2__bd-logo" data-switchable-key="contents.0.useLogo">
                          <img src="https://placehold.jp/400x160.png">
                        </div>
                        <div class="t0-b-headerUnit-siteTitle2__bd-textCol">
                          <p class="t0-b-headerUnit-siteTitle2__bd-note" data-switchable-key="contents.0.useUpperCaption">地元で30年！地域密着型リフォーム専門店</p>
                          <div class="t0-b-headerUnit-siteTitle2__bd-siteName">
                            <p>リンク有り</p>
                          </div>
                        </div>
                      </div>
                    </a>
                    <p class="t0-b-headerUnit-siteTitle2__ft" data-switchable-key="contents.0.useLowerCaption">〒000-0000 東京都千代田区大手町1-9-1</p>
                  </div>
                </div>
              </div>
              <div>
                <div class="t0-b-headerUnit-contact-fax-bPlacer">
                  <div class="t0-b-headerUnit-contact-fax">
                    <div></div>
                    <p>リンク無し</p>
                  </div>
                </div>
              </div>
              <div>
                <div class="t0-b-headerUnit-contact-fax-bPlacer">
                  <div class="t0-b-headerUnit-contact-fax">
                    <div></div>
                    <p>
                      <a href="/">リンク有り</a>
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <div class="t0-b-headerUnit-contact-tel-bPlacer">
                  <div class="t0-b-headerUnit-contact-tel t0-b-headerUnit-contact-tel--size-2">
                    <div class="t0-b-headerUnit-contact-tel__ruby">リンク無し
                      <br>
                      <a href="/">リンク有り</a>
                    </div>
                    <div class="t0-b-headerUnit-contact-tel__bd">
                      <span class="t0-b-headerUnit-contact-tel__tel"></span>
                      <span>03-0000-0000</span>
                    </div>
                    <span></span>
                  </div>
                </div>
              </div>
              <div>
                <div class="t0-b-headerUnit-contact-tel-bPlacer">
                  <div class="t0-b-headerUnit-contact-tel t0-b-headerUnit-contact-tel--size-2">
                    <div class="t0-b-headerUnit-contact-tel__ruby">電話番号の語呂を入力</div>
                    <div class="t0-b-headerUnit-contact-tel__bd">
                      <span class="t0-b-headerUnit-contact-tel__fax"></span>
                      <span>03-0000-0000</span>
                    </div>
                    <span></span>
                  </div>
                </div>
              </div>
              <div>
                <div class="t0-b-headerUnit-contact-tel-bPlacer">
                  <div class="t0-b-headerUnit-contact-tel t0-b-headerUnit-contact-tel--size-2">
                    <div class="t0-b-headerUnit-contact-tel__ruby">電話番号の語呂を入力</div>
                    <div class="t0-b-headerUnit-contact-tel__bd">
                      <span class="t0-b-headerUnit-contact-tel__free"></span>
                      <span>03-0000-0000</span>
                    </div>
                    <span></span>
                  </div>
                </div>
              </div>
              <div>
                <div class="t0-b-headerUnit-contact-tel-bPlacer">
                  <div class="t0-b-headerUnit-contact-tel t0-b-headerUnit-contact-tel--size-2">
                    <div class="t0-b-headerUnit-contact-tel__ruby">電話番号の語呂を入力</div>
                    <div class="t0-b-headerUnit-contact-tel__bd">
                      <span class="t0-b-headerUnit-contact-tel__cell"></span>
                      <span>03-0000-0000</span>
                    </div>
                    <span></span>
                  </div>
                </div>
              </div>
              <div>
                <div class="t0-b-headerUnit-contact-navB-bPlacer">
                  <div class="t0-b-headerUnit-contact-navB">
                    <span>
                      <span>
                        <span></span>
                      </span>
                    </span>
                    <div></div>
                    <p>リンク無し</p>
                  </div>
                </div>
              </div>
              <div>
                <div class="t0-b-headerUnit-contact-navB-bPlacer">
                  <div class="t0-b-headerUnit-contact-navB">
                    <span>
                      <span>
                        <span></span>
                      </span>
                    </span>
                    <a href="/15331956201035" target="">
                      <div></div>
                      <p>リンク有り</p>
                    </a>
                  </div>
                </div>
              </div>
              <div>
                <div class="t0-b-headerUnit-contact-navB2-bPlacer">
                  <div class="t0-b-headerUnit-contact-navB2">
                    <span>
                      <span>
                        <span></span>
                      </span>
                    </span>
                    <div></div>
                    <p>リンク無し</p>
                  </div>
                </div>
              </div>
              <div>
                <div class="t0-b-headerUnit-contact-navB2-bPlacer">
                  <div class="t0-b-headerUnit-contact-navB2">
                    <span>
                      <span>
                        <span></span>
                      </span>
                    </span>
                    <a href="/15331956201035" target="">
                      <div></div>
                      <p>リンク有り</p>
                    </a>
                  </div>
                </div>
              </div>
              <div>
                <div class="t0-b-headerUnit-contact-nav-bPlacer">
                  <div class="t0-b-headerUnit-contact-nav">
                    <div></div>
                    <p>リンク無し</p>
                  </div>
                </div>
              </div>
              <div>
                <div class="t0-b-headerUnit-contact-nav-bPlacer">
                  <div class="t0-b-headerUnit-contact-nav">
                    <a href="/15331956201035" target="">
                      <div></div>
                      <p>リンク有り</p>
                    </a>
                  </div>
                </div>
              </div>
              <div>
                <div class="t0-b-headerUnit-labeledList-bPlacer">
                  <div class="t0-b-headerUnit-labeledList">
                    <table>
                      <tbody>
                        <tr>
                          <th>
                            <span>
                              <span>
                                <span></span>
                              </span>
                            </span>
                            <div>リンク無し</div>
                          </th>
                          <td>
                            <div>リストアイテム</div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div>
                <div class="t0-b-headerUnit-labeledList-bPlacer">
                  <div class="t0-b-headerUnit-labeledList">
                    <table>
                      <tbody>
                        <tr>
                          <th>
                            <span>
                              <span>
                                <span></span>
                              </span>
                            </span>
                            <div>
                              <a href="/">リンク有り</a>
                            </div>
                          </th>
                          <td>
                            <div>
                              <a href="/">リストアイテム</a>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div class="ex-topSpacingTweak-up-1s">
                <div class="t0-b-headerUnit-miniCol-bPlacer">
                  <div class="t0-b-headerUnit-miniCol">
                    <div class="t0-b-headerUnit-miniCol__hd">
                      <div>
                        <span>
                          <span>
                            <span></span>
                          </span>
                        </span>
                        <div>リンク無し</div>
                      </div>
                    </div>
                    <div class="t0-b-headerUnit-miniCol__bd">
                      <div>
                        <span>
                          <span>
                            <span></span>
                          </span>
                        </span>
                        <div>あいうえおかきくけこ</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="ex-topSpacingTweak-up-1s">
                <div class="t0-b-headerUnit-miniCol-bPlacer">
                  <div class="t0-b-headerUnit-miniCol">
                    <div class="t0-b-headerUnit-miniCol__hd">
                      <div>
                        <span>
                          <span>
                            <span></span>
                          </span>
                        </span>
                        <div>
                          <a href="/">リンク有り</a>
                        </div>
                      </div>
                    </div>
                    <div class="t0-b-headerUnit-miniCol__bd">
                      <div>
                        <span>
                          <span>
                            <span></span>
                          </span>
                        </span>
                        <div>
                          <a href="/">あいうえおかきくけこ</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div class="t0-b-headerUnit-siteName2-bPlacer">
                  <div class="t0-b-headerUnit-siteName2 t0-b-headerUnit-siteName2--width-">
                    <div class="t0-b-headerUnit-siteName2__bd">
                      <a href="/15331956201035" target="">
                        <img src="https://placehold.jp/400x160.png">
                      </a>
                    </div>
                    <p class="t0-b-headerUnit-siteName2__ft">リンク無し
                      <br>
                      <a href="/">リンク有り</a>
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <div class="t0-b-headerUnit-text-bPlacer">
                  <div class="t0-b-headerUnit-text">
                    <p>リンク無し</p>
                    <p>
                      <a href="/">リンク有り</a>
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <div class="t0-b-headerUnit-table-bPlacer">
                  <div class="t0-b-headerUnit-table">
                    <table>
                      <tbody>
                        <tr>
                          <th>項目1</th>
                          <th>項目2</th>
                          <th>項目3</th>
                          <th>項目4</th>
                        </tr>
                        <tr>
                          <th>項目1-1</th>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <th>項目1-2</th>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  </div>
</div>
```

#### ヘッダーセットのバリエーションが２のとき

バリエーション２
- 文字色：リンクの文字色：#fff
- 矢印アイコン：白い矢印
- バナーの背景色・影部分：#414141

```html
<div>
  <div class="t0-b-headerSingle2-bPlacer">
    <header class="t0-b-headerSingle2">
      <span>
        <span>
          <span></span>
        </span>
      </span>
      <div class="t0-b-headerSingle2__hd">
        <span>
          <span>
            <span></span>
          </span>
        </span>
        <p>リンク無し
          <br>
          <a href="/">リンク有り</a>
        </p>
      </div>
      <div class="t0-b-headerSingle2__bd">
        <div>
          <span>
            <span>
              <span></span>
            </span>
          </span>
          <div class="t0-b-headerSingle2__col">
            <span>
              <span>
                <span></span>
              </span>
            </span>
            <div class="outerHtml">
              <div>
                <div class="t0-b-headerUnit-siteTitle-bPlacer">
                  <div class="t0-b-headerUnit-siteTitle">
                    <div class="t0-b-headerUnit-siteTitle__bd">
                      <div class="t0-b-headerUnit-siteTitle__bd-logo" data-switchable-key="contents.0.useLogo">
                        <img src="https://placehold.jp/400x160.png">
                      </div>
                      <div class="t0-b-headerUnit-siteTitle__bd-textCol">
                        <p class="t0-b-headerUnit-siteTitle__bd-note" data-switchable-key="contents.0.useUpperCaption">地元で30年！地域密着型リフォーム専門店</p>
                        <div class="t0-b-headerUnit-siteTitle__bd-siteName">
                          <p>リンク無し</p>
                        </div>
                      </div>
                    </div>
                    <p class="t0-b-headerUnit-siteTitle__ft" data-switchable-key="contents.0.useLowerCaption">〒000-0000 東京都千代田区大手町1-9-1</p>
                  </div>
                </div>
              </div>
              <div>
                <div class="t0-b-headerUnit-siteTitle-bPlacer">
                  <div class="t0-b-headerUnit-siteTitle">
                    <a href="/15331956201035" target="">
                      <div class="t0-b-headerUnit-siteTitle__bd">
                        <div class="t0-b-headerUnit-siteTitle__bd-logo" data-switchable-key="contents.0.useLogo">
                          <img src="https://placehold.jp/400x160.png">
                        </div>
                        <div class="t0-b-headerUnit-siteTitle__bd-textCol">
                          <p class="t0-b-headerUnit-siteTitle__bd-note" data-switchable-key="contents.0.useUpperCaption">地元で30年！地域密着型リフォーム専門店</p>
                          <div class="t0-b-headerUnit-siteTitle__bd-siteName">
                            <p>リンク有り</p>
                          </div>
                        </div>
                      </div>
                    </a>
                    <p class="t0-b-headerUnit-siteTitle__ft" data-switchable-key="contents.0.useLowerCaption">〒000-0000 東京都千代田区大手町1-9-1</p>
                  </div>
                </div>
              </div>
              <div>
                <div class="t0-b-headerUnit-siteTitle2-bPlacer">
                  <div class="t0-b-headerUnit-siteTitle2">
                    <div class="t0-b-headerUnit-siteTitle2__bd">
                      <div class="t0-b-headerUnit-siteTitle2__bd-logo" data-switchable-key="contents.0.useLogo">
                        <img src="https://placehold.jp/400x160.png">
                      </div>
                      <div class="t0-b-headerUnit-siteTitle2__bd-textCol">
                        <p class="t0-b-headerUnit-siteTitle2__bd-note" data-switchable-key="contents.0.useUpperCaption">地元で30年！地域密着型リフォーム専門店</p>
                        <div class="t0-b-headerUnit-siteTitle2__bd-siteName">
                          <p>リンク無し</p>
                        </div>
                      </div>
                    </div>
                    <p class="t0-b-headerUnit-siteTitle2__ft" data-switchable-key="contents.0.useLowerCaption">〒000-0000 東京都千代田区大手町1-9-1</p>
                  </div>
                </div>
              </div>
              <div>
                <div class="t0-b-headerUnit-siteTitle2-bPlacer">
                  <div class="t0-b-headerUnit-siteTitle2">
                    <a href="/15331956201035" target="">
                      <div class="t0-b-headerUnit-siteTitle2__bd">
                        <div class="t0-b-headerUnit-siteTitle2__bd-logo" data-switchable-key="contents.0.useLogo">
                          <img src="https://placehold.jp/400x160.png">
                        </div>
                        <div class="t0-b-headerUnit-siteTitle2__bd-textCol">
                          <p class="t0-b-headerUnit-siteTitle2__bd-note" data-switchable-key="contents.0.useUpperCaption">地元で30年！地域密着型リフォーム専門店</p>
                          <div class="t0-b-headerUnit-siteTitle2__bd-siteName">
                            <p>リンク有り</p>
                          </div>
                        </div>
                      </div>
                    </a>
                    <p class="t0-b-headerUnit-siteTitle2__ft" data-switchable-key="contents.0.useLowerCaption">〒000-0000 東京都千代田区大手町1-9-1</p>
                  </div>
                </div>
              </div>
              <div>
                <div class="t0-b-headerUnit-contact-fax-bPlacer">
                  <div class="t0-b-headerUnit-contact-fax">
                    <div></div>
                    <p>リンク無し</p>
                  </div>
                </div>
              </div>
              <div>
                <div class="t0-b-headerUnit-contact-fax-bPlacer">
                  <div class="t0-b-headerUnit-contact-fax">
                    <div></div>
                    <p>
                      <a href="/">リンク有り</a>
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <div class="t0-b-headerUnit-contact-tel-bPlacer">
                  <div class="t0-b-headerUnit-contact-tel t0-b-headerUnit-contact-tel--size-2">
                    <div class="t0-b-headerUnit-contact-tel__ruby">リンク無し
                      <br>
                      <a href="/">リンク有り</a>
                    </div>
                    <div class="t0-b-headerUnit-contact-tel__bd">
                      <span class="t0-b-headerUnit-contact-tel__tel"></span>
                      <span>03-0000-0000</span>
                    </div>
                    <span></span>
                  </div>
                </div>
              </div>
              <div>
                <div class="t0-b-headerUnit-contact-tel-bPlacer">
                  <div class="t0-b-headerUnit-contact-tel t0-b-headerUnit-contact-tel--size-2">
                    <div class="t0-b-headerUnit-contact-tel__ruby">電話番号の語呂を入力</div>
                    <div class="t0-b-headerUnit-contact-tel__bd">
                      <span class="t0-b-headerUnit-contact-tel__fax"></span>
                      <span>03-0000-0000</span>
                    </div>
                    <span></span>
                  </div>
                </div>
              </div>
              <div>
                <div class="t0-b-headerUnit-contact-tel-bPlacer">
                  <div class="t0-b-headerUnit-contact-tel t0-b-headerUnit-contact-tel--size-2">
                    <div class="t0-b-headerUnit-contact-tel__ruby">電話番号の語呂を入力</div>
                    <div class="t0-b-headerUnit-contact-tel__bd">
                      <span class="t0-b-headerUnit-contact-tel__free"></span>
                      <span>03-0000-0000</span>
                    </div>
                    <span></span>
                  </div>
                </div>
              </div>
              <div>
                <div class="t0-b-headerUnit-contact-tel-bPlacer">
                  <div class="t0-b-headerUnit-contact-tel t0-b-headerUnit-contact-tel--size-2">
                    <div class="t0-b-headerUnit-contact-tel__ruby">電話番号の語呂を入力</div>
                    <div class="t0-b-headerUnit-contact-tel__bd">
                      <span class="t0-b-headerUnit-contact-tel__cell"></span>
                      <span>03-0000-0000</span>
                    </div>
                    <span></span>
                  </div>
                </div>
              </div>
              <div>
                <div class="t0-b-headerUnit-contact-navB-bPlacer">
                  <div class="t0-b-headerUnit-contact-navB">
                    <span>
                      <span>
                        <span></span>
                      </span>
                    </span>
                    <div></div>
                    <p>リンク無し</p>
                  </div>
                </div>
              </div>
              <div>
                <div class="t0-b-headerUnit-contact-navB-bPlacer">
                  <div class="t0-b-headerUnit-contact-navB">
                    <span>
                      <span>
                        <span></span>
                      </span>
                    </span>
                    <a href="/15331956201035" target="">
                      <div></div>
                      <p>リンク有り</p>
                    </a>
                  </div>
                </div>
              </div>
              <div>
                <div class="t0-b-headerUnit-contact-navB2-bPlacer">
                  <div class="t0-b-headerUnit-contact-navB2">
                    <span>
                      <span>
                        <span></span>
                      </span>
                    </span>
                    <div></div>
                    <p>リンク無し</p>
                  </div>
                </div>
              </div>
              <div>
                <div class="t0-b-headerUnit-contact-navB2-bPlacer">
                  <div class="t0-b-headerUnit-contact-navB2">
                    <span>
                      <span>
                        <span></span>
                      </span>
                    </span>
                    <a href="/15331956201035" target="">
                      <div></div>
                      <p>リンク有り</p>
                    </a>
                  </div>
                </div>
              </div>
              <div>
                <div class="t0-b-headerUnit-contact-nav-bPlacer">
                  <div class="t0-b-headerUnit-contact-nav">
                    <div></div>
                    <p>リンク無し</p>
                  </div>
                </div>
              </div>
              <div>
                <div class="t0-b-headerUnit-contact-nav-bPlacer">
                  <div class="t0-b-headerUnit-contact-nav">
                    <a href="/15331956201035" target="">
                      <div></div>
                      <p>リンク有り</p>
                    </a>
                  </div>
                </div>
              </div>
              <div>
                <div class="t0-b-headerUnit-labeledList-bPlacer">
                  <div class="t0-b-headerUnit-labeledList">
                    <table>
                      <tbody>
                        <tr>
                          <th>
                            <span>
                              <span>
                                <span></span>
                              </span>
                            </span>
                            <div>リンク無し</div>
                          </th>
                          <td>
                            <div>リストアイテム</div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div>
                <div class="t0-b-headerUnit-labeledList-bPlacer">
                  <div class="t0-b-headerUnit-labeledList">
                    <table>
                      <tbody>
                        <tr>
                          <th>
                            <span>
                              <span>
                                <span></span>
                              </span>
                            </span>
                            <div>
                              <a href="/">リンク有り</a>
                            </div>
                          </th>
                          <td>
                            <div>
                              <a href="/">リストアイテム</a>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div class="ex-topSpacingTweak-up-1s">
                <div class="t0-b-headerUnit-miniCol-bPlacer">
                  <div class="t0-b-headerUnit-miniCol">
                    <div class="t0-b-headerUnit-miniCol__hd">
                      <div>
                        <span>
                          <span>
                            <span></span>
                          </span>
                        </span>
                        <div>リンク無し</div>
                      </div>
                    </div>
                    <div class="t0-b-headerUnit-miniCol__bd">
                      <div>
                        <span>
                          <span>
                            <span></span>
                          </span>
                        </span>
                        <div>あいうえおかきくけこ</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="ex-topSpacingTweak-up-1s">
                <div class="t0-b-headerUnit-miniCol-bPlacer">
                  <div class="t0-b-headerUnit-miniCol">
                    <div class="t0-b-headerUnit-miniCol__hd">
                      <div>
                        <span>
                          <span>
                            <span></span>
                          </span>
                        </span>
                        <div>
                          <a href="/">リンク有り</a>
                        </div>
                      </div>
                    </div>
                    <div class="t0-b-headerUnit-miniCol__bd">
                      <div>
                        <span>
                          <span>
                            <span></span>
                          </span>
                        </span>
                        <div>
                          <a href="/">あいうえおかきくけこ</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div class="t0-b-headerUnit-siteName2-bPlacer">
                  <div class="t0-b-headerUnit-siteName2 t0-b-headerUnit-siteName2--width-">
                    <div class="t0-b-headerUnit-siteName2__bd">
                      <a href="/15331956201035" target="">
                        <img src="https://placehold.jp/400x160.png">
                      </a>
                    </div>
                    <p class="t0-b-headerUnit-siteName2__ft">リンク無し
                      <br>
                      <a href="/">リンク有り</a>
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <div class="t0-b-headerUnit-text-bPlacer">
                  <div class="t0-b-headerUnit-text">
                    <p>リンク無し</p>
                    <p>
                      <a href="/">リンク有り</a>
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <div class="t0-b-headerUnit-table-bPlacer">
                  <div class="t0-b-headerUnit-table">
                    <table>
                      <tbody>
                        <tr>
                          <th>項目1</th>
                          <th>項目2</th>
                          <th>項目3</th>
                          <th>項目4</th>
                        </tr>
                        <tr>
                          <th>項目1-1</th>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <th>項目1-2</th>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  </div>
</div>
```

*/
