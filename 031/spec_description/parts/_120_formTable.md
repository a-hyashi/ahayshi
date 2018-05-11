/*
---
name: 120_フォーム（個別仕様）
tag:
  - main
category:
  - 07.フォーム/120_フォーム
---

### テーマ031 独自のHTML

テーマ共通のHTMLにできるようHTMLを作成したが、commonとして使えるようになるまでは031独自のHTMLとして管理する

#### 変更内容

https://github.com/wmssystem/buddy-theme/issues/80

#### バリエーション1

```html
<form>
  <div class="t0-b-formTable-bPlacer">
    <input type="hidden" />
    <div class="t0-b-formTable">
      <table>
        <colgroup>
          <col />
        </colgroup>
        <tbody>
          <tr>
            <th>
              <div>
                <input type="hidden" value="選択肢フォーム要素（radio）" />
                <label>選択肢フォーム要素（radio）</label>
                <span class="t0-b-formTable__requiredLabel"><span>必須</span></span>
              </div>
            </th>
            <td>
              <div class="t0-b-formTable__radioList t0-b-formTable__radioList--align-vertical">
                <ul>
                  <li>
                    <input type="radio" value="はじめて" />
                    <label>はじめて</label>
                  </li>
                  <li>
                    <input type="radio" value="２回目以降" />
                    <label>２回目以降</label>
                  </li>
                  <li>
                    <input type="radio" value="わからない" />
                    <label>わからない</label>
                  </li>
                </ul>
                <span class="mod-formConfirm" style="display: none;"></span>
              </div>
              <span class="mod-formError">必須項目を入力してください。</span>
              <p class="t0-b-formTable__td-caption">（補足情報）</p>
            </td>
          </tr>
          <tr>
            <th>
              <div>
                <input type="hidden" value="選択肢フォーム要素（checkbox）" />
                <label>選択肢フォーム要素（checkbox）</label>
                <span class="t0-b-formTable__requiredLabel"><span>必須</span></span>
              </div>
            </th>
            <td>
              <div class="t0-b-formTable__checkboxList">
                <ul>
                  <li>
                    <input type="checkbox" value="はじめて" />
                    <label>はじめて</label>
                  </li>
                  <li>
                    <input type="checkbox" value="２回目以降" />
                    <label>２回目以降</label>
                  </li>
                  <li>
                    <input type="checkbox" value="わからない" />
                    <label>わからない</label>
                  </li>
                </ul>
                <span class="mod-formConfirm" style="display: none;"></span>
              </div>
              <p class="t0-b-formTable__td-caption">（補足情報）</p>
            </td>
          </tr>
          <tr>
            <th>
              <div>
                <input type="hidden" value="選択肢フォーム要素（select）" />
                <label>選択肢フォーム要素（select）</label>
                <span class="t0-b-formTable__notRequiredLabel"><span>任意</span></span>
              </div>
            </th>
            <td>
              <div class="t0-b-formTable__singleInput">
                <select>
                  <option value="はじめて">はじめて</option>
                  <option value="２回目以降">２回目以降</option>
                  <option value="わからない">わからない</option>
                </select>
                <span class="mod-formConfirm" style="display: none;"></span>
              </div>
            </td>
          </tr>
          <tr>
            <th>
              <div>
                <input type="hidden" value="一行フォーム要素" />
                <label>一行フォーム要素</label>
                <span class="t0-b-formTable__requiredLabel"><span>必須</span></span>
              </div>
            </th>
            <td>
              <input class="t0-b-formTable__textInput" type="text" />
              <span class="mod-formConfirm" style="display: none;"></span>
              <p class="t0-b-formTable__td-caption">（補足情報）</p>
            </td>
          </tr>
          <tr>
            <th>
              <div>
                <input type="hidden" value="複数行フォーム要素" />
                <label>複数行フォーム要素</label>
                <span class="t0-b-formTable__notRequiredLabel"><span>任意</span></span>
              </div>
            </th>
            <td>
              <textarea class="t0-b-formTable__textarea"></textarea>
              <span class="mod-formConfirm" style="display: none;"></span>
              <p class="t0-b-formTable__td-caption">（補足情報）</p>
            </td>
          </tr>
          <tr>
            <th>
              <div>
                <input type="hidden" value="メールアドレス要素" />
                <label>メールアドレス要素</label>
                <span class="t0-b-formTable__requiredLabel"><span>必須</span></span>
              </div>
            </th>
            <td>
              <input class="t0-b-formTable__email" type="text" />
              <span class="mod-formConfirm" style="display: none;"></span>
              <p class="t0-b-formTable__td-caption">（補足情報）</p>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="t0-b-formTable__buttons mod-form-submit-button">
        <div class="t0-b-formTable__button-confirm">
          <input type="submit" value="送信内容を確認する" />
        </div>
        <p>※次の画面が出るまで、４〜５秒かかりますので、<br />続けて２回押さないようにお願いいたします。
        </p>
      </div>
      <div class="t0-b-formTable__buttons mod-form-confirm-button" style="display: none;">
        <div class="t0-b-formTable__button-edit">
          <input class="mod-form-edit" type="button" value="編集する" />
        </div>
        <div class="t0-b-formTable__button-send">
          <input type="submit" value="送信する" />
        </div>
        <p>※次の画面が出るまで、４〜５秒かかりますので、<br />続けて２回押さないようにお願いいたします。</p>
      </div>
    </div>
  </div>
</form>
```

#### バリエーション2

```html
<form>
  <div class="t0-b-formTable2-bPlacer">
    <input type="hidden" />
    <div class="t0-b-formTable2">
      <table>
        <colgroup>
          <col />
        </colgroup>
        <tbody>
          <tr>
            <th>
              <div>
                <input type="hidden" value="選択肢フォーム要素（radio）" />
                <label>選択肢フォーム要素（radio）</label>
                <span class="t0-b-formTable2__requiredLabel"><span>必須</span></span>
              </div>
            </th>
            <td>
              <div class="t0-b-formTable2__radioList t0-b-formTable2__radioList--align-vertical">
                <ul>
                  <li>
                    <input type="radio" value="はじめて" />
                    <label>はじめて</label>
                  </li>
                  <li>
                    <input type="radio" value="２回目以降" />
                    <label>２回目以降</label>
                  </li>
                  <li>
                    <input type="radio" value="わからない" />
                    <label>わからない</label>
                  </li>
                </ul>
                <span class="mod-formConfirm" style="display: none;"></span>
              </div>
              <span class="mod-formError">必須項目を入力してください。</span>
              <p class="t0-b-formTable2__td-caption">（補足情報）</p>
            </td>
          </tr>
          <tr>
            <th>
              <div>
                <input type="hidden" value="選択肢フォーム要素（checkbox）" />
                <label>選択肢フォーム要素（checkbox）</label>
                <span class="t0-b-formTable2__requiredLabel"><span>必須</span></span>
              </div>
            </th>
            <td>
              <div class="t0-b-formTable2__checkboxList">
                <ul>
                  <li>
                    <input type="checkbox" value="はじめて" />
                    <label>はじめて</label>
                  </li>
                  <li>
                    <input type="checkbox" value="２回目以降" />
                    <label>２回目以降</label>
                  </li>
                  <li>
                    <input type="checkbox" value="わからない" />
                    <label>わからない</label>
                  </li>
                </ul>
                <span class="mod-formConfirm" style="display: none;"></span>
              </div>
              <p class="t0-b-formTable2__td-caption">（補足情報）</p>
            </td>
          </tr>
          <tr>
            <th>
              <div>
                <input type="hidden" value="選択肢フォーム要素（select）" />
                <label>選択肢フォーム要素（select）</label>
                <span class="t0-b-formTable2__notRequiredLabel"><span>任意</span></span>
              </div>
            </th>
            <td>
              <div class="t0-b-formTable2__singleInput">
                <select>
                  <option value="はじめて">はじめて</option>
                  <option value="２回目以降">２回目以降</option>
                  <option value="わからない">わからない</option>
                </select>
                <span class="mod-formConfirm" style="display: none;"></span>
              </div>
            </td>
          </tr>
          <tr>
            <th>
              <div>
                <input type="hidden" value="一行フォーム要素" />
                <label>一行フォーム要素</label>
                <span class="t0-b-formTable2__requiredLabel"><span>必須</span></span>
              </div>
            </th>
            <td>
              <input class="t0-b-formTable2__textInput" type="text" />
              <span class="mod-formConfirm" style="display: none;"></span>
              <p class="t0-b-formTable2__td-caption">（補足情報）</p>
            </td>
          </tr>
          <tr>
            <th>
              <div>
                <input type="hidden" value="複数行フォーム要素" />
                <label>複数行フォーム要素</label>
                <span class="t0-b-formTable2__notRequiredLabel"><span>任意</span></span>
              </div>
            </th>
            <td>
              <textarea class="t0-b-formTable2__textarea"></textarea>
              <span class="mod-formConfirm" style="display: none;"></span>
              <p class="t0-b-formTable2__td-caption">（補足情報）</p>
            </td>
          </tr>
          <tr>
            <th>
              <div>
                <input type="hidden" value="メールアドレス要素" />
                <label>メールアドレス要素</label>
                <span class="t0-b-formTable2__requiredLabel"><span>必須</span></span>
              </div>
            </th>
            <td>
              <input class="t0-b-formTable2__email" type="text" />
              <span class="mod-formConfirm" style="display: none;"></span>
              <p class="t0-b-formTable2__td-caption">（補足情報）</p>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="t0-b-formTable2__buttons mod-form-submit-button">
        <div class="t0-b-formTable2__button-confirm">
          <input type="submit" value="送信内容を確認する" />
        </div>
        <p>※次の画面が出るまで、４〜５秒かかりますので、<br />続けて２回押さないようにお願いいたします。</p>
      </div>
      <div class="t0-b-formTable2__buttons mod-form-confirm-button" style="display: none;">
        <div class="t0-b-formTable2__button-edit">
          <input class="mod-form-edit" type="button" value="編集する" />
        </div>
        <div class="t0-b-formTable2__button-send">
          <input type="submit" value="送信する" />
        </div>
        <p>※次の画面が出るまで、４〜５秒かかりますので、<br />続けて２回押さないようにお願いいたします。</p>
      </div>
    </div>
  </div>
</form>
```

*/

/*
---
name: 120_フォーム（確認用）（個別仕様）
tag:
  - main
category:
  - 07.フォーム/120_フォーム
---

#### バリエーション1

```html
<form>
  <div class="t0-b-formTable-bPlacer">
    <input type="hidden" />
    <div class="t0-b-formTable">
      <table>
        <colgroup>
          <col />
        </colgroup>
        <tbody>
          <tr>
            <th>
              <div>
                <input type="hidden" value="選択肢フォーム要素（radio）" />
                <label>選択肢フォーム要素（radio）</label>
                <span class="t0-b-formTable__requiredLabel"><span>必須</span></span>
              </div>
            </th>
            <td>
              <div class="t0-b-formTable__radioList t0-b-formTable__radioList--align-vertical">
                <ul>
                  <li>
                    <input type="radio" value="はじめて" />
                    <label>はじめて</label>
                  </li>
                  <li>
                    <input type="radio" value="２回目以降" />
                    <label>２回目以降</label>
                  </li>
                  <li>
                    <input type="radio" value="わからない" />
                    <label>わからない</label>
                  </li>
                </ul>
                <span class="mod-formConfirm" style="display: none;"></span>
              </div>
              <span class="mod-formError">必須項目を入力してください。</span>
              <p class="t0-b-formTable__td-caption">（並び方向：縦）</p>
            </td>
          </tr>
          <tr>
            <th>
              <div>
                <input type="hidden" value="選択肢フォーム要素（radio）" />
                <label>選択肢フォーム要素（radio）</label>
                <span class="t0-b-formTable__requiredLabel"><span>必須</span></span>
              </div>
            </th>
            <td>
              <div class="t0-b-formTable__radioList">
                <ul>
                  <li>
                    <input type="radio" value="はじめて" />
                    <label>はじめて</label>
                  </li>
                  <li>
                    <input type="radio" value="２回目以降" />
                    <label>２回目以降</label>
                  </li>
                  <li>
                    <input type="radio" value="わからない" />
                    <label>わからない</label>
                  </li>
                </ul>
                <span class="mod-formConfirm" style="display: none;"></span>
              </div>
              <p class="t0-b-formTable__td-caption">（並び方向：横）</p>
            </td>
          </tr>
          <tr>
            <th>
              <div>
                <input type="hidden" value="選択肢フォーム要素（checkbox）" />
                <label>選択肢フォーム要素（checkbox）</label>
                <span class="t0-b-formTable__requiredLabel"><span>必須</span></span>
              </div>
            </th>
            <td>
              <div class="t0-b-formTable__checkboxList t0-b-formTable__checkboxList--align-vertical">
                <ul>
                  <li>
                    <input type="checkbox" value="はじめて" />
                    <label>はじめて</label>
                  </li>
                  <li>
                    <input type="checkbox" value="２回目以降" />
                    <label>２回目以降</label>
                  </li>
                  <li>
                    <input type="checkbox" value="わからない" />
                    <label>わからない</label>
                  </li>
                </ul>
                <span class="mod-formConfirm" style="display: none;"></span>
              </div>
              <p class="t0-b-formTable__td-caption">（並び方向：縦）</p>
            </td>
          </tr>
          <tr>
            <th>
              <div>
                <input type="hidden" value="選択肢フォーム要素（checkbox）" />
                <label>選択肢フォーム要素（checkbox）</label>
                <span class="t0-b-formTable__requiredLabel"><span>必須</span></span>
              </div>
            </th>
            <td>
              <div class="t0-b-formTable__checkboxList">
                <ul>
                  <li>
                    <input type="checkbox" value="はじめて" />
                    <label>はじめて</label>
                  </li>
                  <li>
                    <input type="checkbox" value="２回目以降" />
                    <label>２回目以降</label>
                  </li>
                  <li>
                    <input type="checkbox" value="わからない" />
                    <label>わからない</label>
                  </li>
                </ul>
                <span class="mod-formConfirm" style="display: none;"></span>
              </div>
              <p class="t0-b-formTable__td-caption">（並び方向：横）</p>
            </td>
          </tr>
          <tr>
            <th>
              <div>
                <input type="hidden" value="選択肢フォーム要素（select）" />
                <label>選択肢フォーム要素（select）</label>
                <span class="t0-b-formTable__requiredLabel"><span>必須</span></span>
              </div>
            </th>
            <td>
              <div class="t0-b-formTable__singleInput">
                <select>
                  <option value="はじめて">はじめて</option>
                  <option value="２回目以降">２回目以降</option>
                  <option value="わからない">わからない</option>
                </select>
                <span class="mod-formConfirm" style="display: none;"></span>
              </div>
            </td>
          </tr>
          <tr>
            <th>
              <div>
                <input type="hidden" value="一行フォーム要素" />
                <label>一行フォーム要素</label>
                <span class="t0-b-formTable__requiredLabel"><span>必須</span></span>
              </div>
            </th>
            <td>
              <input class="t0-b-formTable__textInput" type="text" />
              <span class="mod-formConfirm" style="display: none;"></span>
              <p class="t0-b-formTable__td-caption">（補足情報）</p>
            </td>
          </tr>
          <tr>
            <th>
              <div>
                <input type="hidden" value="複数行フォーム要素" />
                <label>複数行フォーム要素</label>
                <span class="t0-b-formTable__notRequiredLabel"><span>任意</span></span>
              </div>
            </th>
            <td>
              <textarea class="t0-b-formTable__textarea"></textarea>
              <span class="mod-formConfirm" style="display: none;"></span>
              <p class="t0-b-formTable__td-caption">（補足情報）</p>
            </td>
          </tr>
          <tr>
            <th>
              <div>
                <input type="hidden" value="メールアドレス要素" />
                <label>メールアドレス要素</label>
                <span class="t0-b-formTable__requiredLabel"><span>必須</span></span>
              </div>
            </th>
            <td>
              <input class="t0-b-formTable__email" type="text" />
              <span class="mod-formConfirm" style="display: none;"></span>
              <p class="t0-b-formTable__td-caption">（補足情報）</p>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="t0-b-formTable__buttons mod-form-submit-button">
        <div class="t0-b-formTable__button-confirm">
          <input type="submit" value="送信内容を確認する" />
        </div>
        <p>テキストを入力してください</p>
      </div>
      <div class="t0-b-formTable__buttons mod-form-confirm-button" style="display: none;">
        <div class="t0-b-formTable__button-edit">
          <input class="mod-form-edit" type="button" value="編集する" />
        </div>
        <div class="t0-b-formTable__button-send">
          <input type="submit" value="送信する" />
        </div>
        <p>※次の画面が出るまで、４〜５秒かかりますので、<br />続けて２回押さないようにお願いいたします。</p>
      </div>

      <div class="t0-b-formTable__buttons mod-form-submit-button" style="display: none;">
        <div class="t0-b-formTable__button-confirm">
          <input type="submit" value="送信内容を確認する" />
        </div>
        <p>テキストを入力してください</p>
      </div>
      <div class="t0-b-formTable__buttons mod-form-confirm-button">
        <div class="t0-b-formTable__button-edit">
          <input class="mod-form-edit" type="button" value="編集する" />
        </div>
        <div class="t0-b-formTable__button-send">
          <input type="submit" value="送信する" />
        </div>
        <p>※次の画面が出るまで、４〜５秒かかりますので、<br />続けて２回押さないようにお願いいたします。</p>
      </div>

      <div class="t0-b-formTable__buttons mod-form-submit-button" style="display: none;">
        <div class="t0-b-formTable__button-confirm">
          <input type="submit" value="送信内容を確認する" />
        </div>
        <p>テキストを入力してください</p>
      </div>
      <div class="t0-b-formTable__buttons mod-form-confirm-button">
        <div class="t0-b-formTable__button-edit">
          <input class="mod-form-edit" style="display: none;" type="button" value="編集する" />
        </div>
        <div class="t0-b-formTable__button-send">
          <input type="submit" value="送信する" />
        </div>
        <p>※次の画面が出るまで、４〜５秒かかりますので、<br />続けて２回押さないようにお願いいたします。</p>
      </div>

    </div>
  </div>
</form>
```

#### バリエーション2

```html
<form>
  <div class="t0-b-formTable2-bPlacer">
    <input type="hidden" />
    <div class="t0-b-formTable2">
      <table>
        <colgroup>
          <col />
        </colgroup>
        <tbody>
          <tr>
            <th>
              <div>
                <input type="hidden" value="選択肢フォーム要素（radio）" />
                <label>選択肢フォーム要素（radio）</label>
                <span class="t0-b-formTable2__requiredLabel"><span>必須</span></span>
              </div>
            </th>
            <td>
              <div class="t0-b-formTable2__radioList t0-b-formTable2__radioList--align-vertical">
                <ul>
                  <li>
                    <input type="radio" value="はじめて" />
                    <label>はじめて</label>
                  </li>
                  <li>
                    <input type="radio" value="２回目以降" />
                    <label>２回目以降</label>
                  </li>
                  <li>
                    <input type="radio" value="わからない" />
                    <label>わからない</label>
                  </li>
                </ul>
                <span class="mod-formConfirm" style="display: none;"></span>
              </div>
              <span class="mod-formError">必須項目を入力してください。</span>
              <p class="t0-b-formTable2__td-caption">（並び方向：縦）</p>
            </td>
          </tr>
          <tr>
            <th>
              <div>
                <input type="hidden" value="選択肢フォーム要素（radio）" />
                <label>選択肢フォーム要素（radio）</label>
                <span class="t0-b-formTable2__requiredLabel"><span>必須</span></span>
              </div>
            </th>
            <td>
              <div class="t0-b-formTable2__radioList">
                <ul>
                  <li>
                    <input type="radio" value="はじめて" />
                    <label>はじめて</label>
                  </li>
                  <li>
                    <input type="radio" value="２回目以降" />
                    <label>２回目以降</label>
                  </li>
                  <li>
                    <input type="radio" value="わからない" />
                    <label>わからない</label>
                  </li>
                </ul>
                <span class="mod-formConfirm" style="display: none;"></span>
              </div>
              <p class="t0-b-formTable2__td-caption">（並び方向：横）</p>
            </td>
          </tr>
          <tr>
            <th>
              <div>
                <input type="hidden" value="選択肢フォーム要素（checkbox）" />
                <label>選択肢フォーム要素（checkbox）</label>
                <span class="t0-b-formTable2__requiredLabel"><span>必須</span></span>
              </div>
            </th>
            <td>
              <div class="t0-b-formTable2__checkboxList t0-b-formTable2__checkboxList--align-vertical">
                <ul>
                  <li>
                    <input type="checkbox" value="はじめて" />
                    <label>はじめて</label>
                  </li>
                  <li>
                    <input type="checkbox" value="２回目以降" />
                    <label>２回目以降</label>
                  </li>
                  <li>
                    <input type="checkbox" value="わからない" />
                    <label>わからない</label>
                  </li>
                </ul>
                <span class="mod-formConfirm" style="display: none;"></span>
              </div>
              <p class="t0-b-formTable2__td-caption">（並び方向：縦）</p>
            </td>
          </tr>
          <tr>
            <th>
              <div>
                <input type="hidden" value="選択肢フォーム要素（checkbox）" />
                <label>選択肢フォーム要素（checkbox）</label>
                <span class="t0-b-formTable2__requiredLabel"><span>必須</span></span>
              </div>
            </th>
            <td>
              <div class="t0-b-formTable2__checkboxList">
                <ul>
                  <li>
                    <input type="checkbox" value="はじめて" />
                    <label>はじめて</label>
                  </li>
                  <li>
                    <input type="checkbox" value="２回目以降" />
                    <label>２回目以降</label>
                  </li>
                  <li>
                    <input type="checkbox" value="わからない" />
                    <label>わからない</label>
                  </li>
                </ul>
                <span class="mod-formConfirm" style="display: none;"></span>
              </div>
              <p class="t0-b-formTable2__td-caption">（並び方向：横）</p>
            </td>
          </tr>
          <tr>
            <th>
              <div>
                <input type="hidden" value="選択肢フォーム要素（select）" />
                <label>選択肢フォーム要素（select）</label>
                <span class="t0-b-formTable2__requiredLabel"><span>必須</span></span>
              </div>
            </th>
            <td>
              <div class="t0-b-formTable2__singleInput">
                <select>
                  <option value="はじめて">はじめて</option>
                  <option value="２回目以降">２回目以降</option>
                  <option value="わからない">わからない</option>
                </select>
                <span class="mod-formConfirm" style="display: none;"></span>
              </div>
            </td>
          </tr>
          <tr>
            <th>
              <div>
                <input type="hidden" value="一行フォーム要素" />
                <label>一行フォーム要素</label>
                <span class="t0-b-formTable2__requiredLabel"><span>必須</span></span>
              </div>
            </th>
            <td>
              <input class="t0-b-formTable2__textInput" type="text" />
              <span class="mod-formConfirm" style="display: none;"></span>
              <p class="t0-b-formTable2__td-caption">（補足情報）</p>
            </td>
          </tr>
          <tr>
            <th>
              <div>
                <input type="hidden" value="複数行フォーム要素" />
                <label>複数行フォーム要素</label>
                <span class="t0-b-formTable2__notRequiredLabel"><span>任意</span></span>
              </div>
            </th>
            <td>
              <textarea class="t0-b-formTable2__textarea"></textarea>
              <span class="mod-formConfirm" style="display: none;"></span>
              <p class="t0-b-formTable2__td-caption">（補足情報）</p>
            </td>
          </tr>
          <tr>
            <th>
              <div>
                <input type="hidden" value="メールアドレス要素" />
                <label>メールアドレス要素</label>
                <span class="t0-b-formTable2__requiredLabel"><span>必須</span></span>
              </div>
            </th>
            <td>
              <input class="t0-b-formTable2__email" type="text" />
              <span class="mod-formConfirm" style="display: none;"></span>
              <p class="t0-b-formTable2__td-caption">（補足情報）</p>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="t0-b-formTable2__buttons mod-form-submit-button">
        <div class="t0-b-formTable2__button-confirm">
          <input type="submit" value="送信内容を確認する" />
        </div>
        <p>テキストを入力してください</p>
      </div>
      <div class="t0-b-formTable2__buttons mod-form-confirm-button" style="display: none;">
        <div class="t0-b-formTable2__button-edit">
          <input class="mod-form-edit" type="button" value="編集する" />
        </div>
        <div class="t0-b-formTable2__button-send">
          <input type="submit" value="送信する" />
        </div>
        <p>※次の画面が出るまで、４〜５秒かかりますので、<br />続けて２回押さないようにお願いいたします。</p>
      </div>

      <div class="t0-b-formTable2__buttons mod-form-submit-button" style="display: none;">
        <div class="t0-b-formTable2__button-confirm">
          <input type="submit" value="送信内容を確認する" />
        </div>
        <p>テキストを入力してください</p>
      </div>
      <div class="t0-b-formTable2__buttons mod-form-confirm-button">
        <div class="t0-b-formTable2__button-edit">
          <input class="mod-form-edit" type="button" value="編集する" />
        </div>
        <div class="t0-b-formTable2__button-send">
          <input type="submit" value="送信する" />
        </div>
        <p>※次の画面が出るまで、４〜５秒かかりますので、<br />続けて２回押さないようにお願いいたします。</p>
      </div>

      <div class="t0-b-formTable2__buttons mod-form-submit-button" style="display: none;">
        <div class="t0-b-formTable2__button-confirm">
          <input type="submit" value="送信内容を確認する" />
        </div>
        <p>テキストを入力してください</p>
      </div>
      <div class="t0-b-formTable2__buttons mod-form-confirm-button">
        <div class="t0-b-formTable2__button-edit">
          <input class="mod-form-edit" style="display: none;" type="button" value="編集する" />
        </div>
        <div class="t0-b-formTable2__button-send">
          <input type="submit" value="送信する" />
        </div>
        <p>※次の画面が出るまで、４〜５秒かかりますので、<br />続けて２回押さないようにお願いいたします。</p>
      </div>

    </div>
  </div>
</form>
```

*/