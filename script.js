/* =========================================================
   이김²팀 발표 페이지 - 움직임을 담당하는 파일

   이 파일이 하는 일 (한 줄 요약)
   - 목차 카드들이 기차처럼 천천히 옆으로 지나가요.
   - 카드를 누르면 카드들이 한 묶음으로 모였다가
     왼쪽에 줄을 서고, 오른쪽에 설명이 나와요.
   - 같은 카드를 한 번 더 누르면 설명이 사라지고
     카드들이 다시 기차처럼 지나가요.
   ========================================================= */


/* ---------------------------------------------------------
   1. 정해진 숫자들 (바뀌지 않는 약속)
   --------------------------------------------------------- */
const totalCards = 10;     // 목차 카드는 모두 10장이에요.
const visibleCards = 4;    // 화면에는 한 번에 4장이 보여요.
const CARD_GAP = 20;       // 카드와 카드 사이 빈칸은 20px이에요. (style.css의 .card-track gap과 같아야 해요)
const ROLL_SPEED = 55;     // 아래 포스터 띠 속도예요. 1초에 55px 움직여요.
const CARD_SPEED = 35;     // 위 목차 카드 속도예요. 1초에 35px 움직여요. (숫자가 작을수록 느려요)
const SIDEBAR_WIDTH = 240; // 왼쪽에 줄 선 카드의 너비예요. (style.css의 사이드바 너비와 같아야 해요)
const GATHER_TIME = 1150;   // 카드가 한 묶음으로 모이는 데 걸리는 시간이에요. (style.css의 0.9s 움직임 + 0.25초 쉼, 둘을 같이 바꿔요)


/* ---------------------------------------------------------
   2. 지금 상태를 기억하는 칸들 (계속 바뀌어요)
   --------------------------------------------------------- */
let currentIndex = 0;      // 지금 화면 맨 왼쪽에 있는 카드가 몇 번째인지 (0이 첫 번째, 0.5면 반쯤 지나감)
let openedNum = 0;         // 지금 펼쳐서 보고 있는 목차 번호 (0이면 아무것도 안 펼쳤어요)
let isSliding = false;     // 화살표를 눌러서 카드가 움직이는 중이면 true
let isHovering = false;    // 마우스가 카드 위에 올라가 있으면 true


/* ---------------------------------------------------------
   3. 자주 쓰는 화면 조각들을 미리 찾아 두기
   --------------------------------------------------------- */
const mainEl = document.querySelector('.main-container');       // 카드와 설명 상자를 담은 큰 상자
const cardTrackEl = document.getElementById('cardTrack');       // 카드들이 올라탄 기차
const detailBox = document.getElementById('detailBox');         // 오른쪽 설명 상자
const detailTitle = document.getElementById('detailTitle');     // 설명 상자의 제목 자리
const detailContent = document.getElementById('detailContent'); // 설명 상자의 내용 자리


/* ---------------------------------------------------------
   4. 목차마다 보여 줄 내용
   - 1번부터 10번까지 순서대로 적어 두었어요.
   - 내용을 고치고 싶으면 여기만 고치면 돼요.
   --------------------------------------------------------- */
const IMG = 'style="max-width:100%; border-radius:8px; margin-top:10px;"';        // 그냥 사진 모양
const CHART_IMG = 'style="width:100%; border-radius:8px; margin-bottom:10px;"';  // 그래프 사진 모양

const PAGES = [
// 1. 팀 소개 — 넷플릭스 상세 프로필
    {
        title: '1. 팀 소개',
        html: `
            <section class="profile-select"
                     aria-label="팀원 프로필 선택">

                <p class="profile-select-kicker">
                    WHO'S ON THE TEAM?
                </p>

                <h2 class="profile-select-title">
                    함께할 팀원을 선택해 주세요.
                </h2>

                <p class="profile-select-subtitle">
                    프로필을 선택해 팀원을 알아보세요.
                </p>

                <div class="profile-select-grid">

                    <!-- 이승은 -->
                    <!-- 이승은 -->
                    <details name="team-profiles" class="profile-person profile-red">
                        <summary aria-label="이승은 프로필 보기">
                            <span class="profile-picture">
                                <span class="profile-initial">이</span>
                                <img src="./pjfile/승은 고양이.jpg"
                                     alt=""
                                     onerror="this.style.display='none'">
                            </span>
                            <span class="profile-name">이승은</span>
                        </summary>
                    </details>

                    <!-- 김경민 -->
                    <details name="team-profiles" class="profile-person profile-yellow">
                        <summary aria-label="김경민 프로필 보기">
                            <span class="profile-picture">
                                <span class="profile-initial">김</span>
                                <img src="./pjfile/경민 고양이.jpg"
                                     alt=""
                                     onerror="this.style.display='none'">
                            </span>
                            <span class="profile-name">김경민</span>
                        </summary>
                    </details>

                    <!-- 김고요 -->
                    <details name="team-profiles" class="profile-person profile-cyan">
                        <summary aria-label="김고요 프로필 보기">
                            <span class="profile-picture">
                                <span class="profile-initial">김</span>
                                <img src="./pjfile/고요 고양이.png"
                                     alt=""
                                     onerror="this.style.display='none'">
                            </span>
                            <span class="profile-name">김고요</span>
                        </summary>
                    </details>

                    <!-- 이가영 -->
                    <details name="team-profiles" class="profile-person profile-gray">
                        <summary aria-label="이가영 프로필 보기">
                            <span class="profile-picture">
                                <span class="profile-initial">이</span>
                                <img src="./pjfile/가영 고양이.jpg"
                                     alt=""
                                     onerror="this.style.display='none'">
                            </span>
                            <span class="profile-name">이가영</span>
                        </summary>
                    </details>

                </div>

                <!-- 팀원 상세 소개 영역 -->
                <div class="team-profile-details">

                    <!-- 이승은 상세 소개 -->
                    <div class="team-info-card team-info-red">
                        <span class="team-info-label">TEAM LEADER</span>
                        <h3>이승은</h3>
                        <p class="team-info-intro">
                            팀을 이끌어가는 리더입니다.
                        </p>

                        <h4>PROJECT ROLE</h4>
                        <p>팀장</p>

                        <h4>MAIN TASKS</h4>
                        <p>시각화</p>
                    </div>

                    <!-- 김경민 상세 소개 -->
                    <div class="team-info-card team-info-yellow">
                        <span class="team-info-label">TEAM MEMBER</span>
                        <h3>김경민</h3>
                        <p class="team-info-intro">
                            웹툰 원작 드라마의 성공 요인을 분석하는 팀원입니다.
                        </p>

                        <h4>PROJECT ROLE</h4>
                        <p>팀원</p>

                        <h4>MAIN TASKS</h4>
                        <p>웹페이지</p>
                    </div>

                    <!-- 김고요 상세 소개 -->
                    <div class="team-info-card team-info-cyan">
                        <span class="team-info-label">TEAM MEMBER</span>
                        <h3>김고요</h3>
                        <p class="team-info-intro">
                            웹툰 원작 드라마의 성공 요인을 분석하는 팀원입니다.
                        </p>

                        <h4>PROJECT ROLE</h4>
                        <p>팀원</p>

                        <h4>MAIN TASKS</h4>
                        <p>데이터 분석</p>
                    </div>

                    <!-- 이가영 상세 소개 -->
                    <div class="team-info-card team-info-gray">
                        <span class="team-info-label">TEAM MEMBER</span>
                        <h3>이가영</h3>
                        <p class="team-info-intro">
                            웹툰 원작 드라마의 성공 요인을 분석하는 팀원입니다.
                        </p>

                        <h4>PROJECT ROLE</h4>
                        <p>팀원</p>

                        <h4>MAIN TASKS</h4>
                        <p>웹 UI/UX 디자인</p>
                    </div>

                </div>

                <p class="profile-select-footer">
                    WEBTOON × DRAMA · DATA ANALYSIS PROJECT
                </p>

            </section>
        `,
    },

    // 2. 분석 배경 및 목표 (공통 디자인: 영어 소제목 + 큰 한글 제목 + 설명)
    {
        title: '분석 배경 및 목표',
        html: `
        <section class="sec">
            <p class="sec-kicker">BACKGROUND &amp; GOAL</p>
            <h2 class="sec-title">웹툰 원작 드라마, 무엇이 흥행을 만들까?</h2>
            <p class="sec-desc">웹툰과 드라마 시장의 변화를 살펴보고, 웹툰 원작 드라마가 흥행하는 조건을 찾습니다.</p>

            <!-- 큰 토글 1: 배경 -->
            <details class="sec-card">
                <summary>
                    <span class="sec-card-kicker">01 · BACKGROUND</span>
                    <span class="sec-card-title">웹툰 시장과 드라마 시장의 변화</span>
                </summary>
                <div class="sec-card-body">
                    <!-- 작은 토글들 -->
                    <details class="sec-sub">
                        <summary>쏟아져 나오는 웹툰 원작 드라마들</summary>
                        <!-- 쌍 이미지 3장 (웹툰 → 드라마). 바꾸려면 파일 이름만 바꾸면 돼요 -->
                        <div class="sec-pairs">
                            <img src="./pjfile/pair_스위트홈.png" alt="스위트홈 웹툰과 드라마">
                            <img src="./pjfile/pair_지금우리학교는.png" alt="지금 우리 학교는 웹툰과 드라마">
                            <img src="./pjfile/pair_DP.png" alt="D.P. 웹툰과 드라마">
                        </div>
                    </details>
                    <details class="sec-sub">
                        <summary>웹툰을 원작으로 하는 드라마 수 추이</summary>
                        <iframe class="sec-frame" data-src="./pjfile/period_trend_chart.html" title="시기별 웹툰 원작 드라마 추이 그래프"></iframe>   <!-- 팀원이 만든 움직이는 그래프 (토글을 열 때 불러와요) -->
                    </details>
                </div>
            </details>

            <!-- 큰 토글 2: 목표와 가설 -->
            <details class="sec-card">
                <summary>
                    <span class="sec-card-kicker">02 · GOAL &amp; HYPOTHESIS</span>
                    <span class="sec-card-title">목표 및 가설</span>
                </summary>
                <div class="sec-card-body">
                    <p class="sec-label">GOAL</p>
                    <p class="sec-goal">웹툰 원작 드라마의 성공 요인 분석</p>

                    <p class="sec-label">HYPOTHESIS</p>

                    <!-- 1차 가설: 번호는 data-num에 적은 글자가 그대로 나와요 -->
                    <p class="sec-hyp-title">1차 가설</p>
                    <ol class="sec-list sec-list-num">
                        <li data-num="1-1">높은 평가를 받은 웹툰 원작을 가진 드라마일수록 흥행했을 것이다.</li>
                        <li data-num="1-2">기존 드라마들이 성공하던 방식을 적용한 드라마들이 흥행했을 것이다.</li>
                    </ol>

                    <!-- 2차 가설: 지금까지 살펴본 변수들 (토글) -->
                    <details class="sec-sub sec-hyp-sub">
                        <summary>2차 가설</summary>
                        <ol class="sec-list sec-list-num">
                            <li data-num="2-1">고자극 장르(액션·스릴러·호러·판타지)일수록 흥행했을 것이다.</li>
                            <li data-num="2-2">로맨스 장르일수록 흥행했을 것이다.</li>
                            <li data-num="2-3">OTT에서 방영된 드라마일수록 흥행했을 것이다. (지상파·케이블과 비교)</li>
                            <li data-num="2-4">넷플릭스에서 방영된 드라마일수록 흥행했을 것이다.</li>
                            <li data-num="2-5">해외 유통(Viki)이 있는 드라마일수록 흥행했을 것이다.</li>
                            <li data-num="2-6">주말에 편성된 드라마일수록 흥행했을 것이다.</li>
                            <li data-num="2-7">19세 등급을 받은 드라마일수록 흥행했을 것이다.</li>
                            <li data-num="2-8">방영 시간이 짧은 드라마일수록 흥행했을 것이다.</li>
                            <li data-num="2-9">원작 플랫폼(네이버·다음·카카오페이지)에 따라 흥행 정도가 다를 것이다.</li>
                        </ol>
                    </details>
                </div>
            </details>
        </section>
        `,
    },
    // 3. 분석 기준 및 방법 (공통 디자인, 새 데이터 kdramalist 기준)
    {
        title: '분석 기준 및 방법',
        html: `
        <section class="sec">
            <p class="sec-kicker">CRITERIA &amp; METHOD</p>
            <h2 class="sec-title">무엇을 기준으로, 어떻게 비교했나</h2>
            <p class="sec-desc">흥행을 데이터로 잴 수 있게 정하고, 조건마다 웹툰 원작 드라마의 순위를 비교했습니다.</p>

            <!-- 큰 토글 1: 분석 기준 -->
            <details class="sec-card">
                <summary>
                    <span class="sec-card-kicker">01 · CRITERIA</span>
                    <span class="sec-card-title">분석 기준</span>
                </summary>
                <div class="sec-card-body">
                    <dl class="sec-def">
                        <dt>분석 대상</dt>
                        <dd>MyDramaList 한국 드라마 1,278편 중 정리 후 남은 1,218편 (~2022년 방영)</dd>
                        <dt>흥행</dt>
                        <dd>드라마 순위(Ranked)를 기준으로 봄. 순위 숫자가 작을수록 흥행한 작품</dd>
                        <dt>순위의 의미</dt>
                        <dd>MyDramaList 이용자 평점을 바탕으로 매긴 사이트 전체 순위 (시청률 · 조회수가 아님)</dd>
                        <dt>상위 %</dt>
                        <dd>그룹의 중앙 순위가 전체 드라마 중 앞에서 몇 % 안에 드는지. 그래프 막대가 높을수록 상위</dd>
                        <dt>웹툰 원작</dt>
                        <dd>웹툰을 원작으로 한 드라마 69편. 웹에 연재되지 않은 출판만화는 제외</dd>
                        <dt>고자극</dt>
                        <dd>장르에 액션 · 스릴러 · 호러 · 판타지 중 하나라도 포함된 작품</dd>
                        <dt>OTT 방영</dt>
                        <dd>처음 방영한 곳에 OTT가 하나라도 있는 작품 (넷플릭스 · TVING · 쿠팡플레이 · 왓챠 등, TV 동시 방영 포함)</dd>
                        <dt>방영 시간</dt>
                        <dd>회당 길이 × 회차 수 = 총 방영 시간. 전체 드라마 중앙값(1,120분)보다 짧으면 '짧음'</dd>
                        <dt>시즌제</dt>
                        <dd>데이터에서 시즌이 한 편으로 합쳐져 있음 (예: 킹덤, 유미의 세포들)</dd>
                        <dt>비교 값</dt>
                        <dd>중앙 순위를 중심으로 봄. 순위가 수만 위대인 작품이 섞여 있어 평균은 크게 끌려가기 때문</dd>
                    </dl>
                </div>
            </details>

            <!-- 큰 토글 2: 분석 방법 -->
            <details class="sec-card">
                <summary>
                    <span class="sec-card-kicker">02 · METHOD</span>
                    <span class="sec-card-title">분석 방법</span>
                </summary>
                <div class="sec-card-body">
                    <ol class="sec-list">
                        <li><div>
                            <strong>웹툰 원작 vs 비원작 비교</strong>
                            <p>웹툰 원작 69편과 비원작 1,133편의 중앙 순위를 비교해, 원작 여부만으로 차이가 있는지 확인했습니다.</p>
                        </div></li>
                        <li><div>
                            <strong>최초 가설 적용</strong>
                            <p>기존 드라마 성공 문법에 웹툰 원작 드라마들을 대입해보고, 해당 방법이 효과가 있었는지를 확인했습니다.</p>
                        </div></li>
                        <li><div>
                            <strong>추가 가설 적용 </strong>
                            <p>웹툰 원작 안에서 여러 가설을 적용한 조건을 추가하고, 조건에 해당하는 작품들의 중앙 순위를 비교했습니다. 이후 조건을 겹쳐 적용하며(예: 고자극 × OTT) 순위가 가장 높게 나타나는 조합을 찾았습니다.
                               조건을 겹칠수록 편수가 줄어들기 때문에, 결과는 인과가 아닌 경향으로 해석합니다.</p>
                        </div></li>
                    </ol>
                </div>
            </details>
        </section>
        `,
    },
 // 4. 사용한 라이브러리 및 데이터 전처리 과정
{
    title: '사용한 라이브러리 및 데이터 전처리 과정',
    html: `
        <section class="sec research-section">

            <p class="sec-kicker">DATA &amp; PREPROCESSING</p>

            <h2 class="sec-title">
                어떤 재료로, 어떻게 다듬었나
            </h2>

            <p class="sec-desc">
                드라마 250편 데이터에 원작 정보를 더하고,
                분석에 쓸 수 있는 모양으로 정리했습니다.
            </p>

            <!-- ==========================================
                 01. 사용한 데이터와 도구
            =========================================== -->
            <details class="sec-card research-accordion" open>

                <summary>
                    <span class="sec-card-kicker">
                        01 · DATA &amp; TOOLS
                    </span>
                    <span class="sec-card-title">
                        사용한 데이터와 도구
                    </span>
                </summary>

                <div class="sec-card-body research-body">

                    <!-- 데이터 수집 -->
                    <div class="research-group">

                        <div class="research-group-heading">
                            <span>DATA SOURCES</span>
                            <span class="research-group-line"></span>
                        </div>

                        <div class="research-icon-grid">

                            <div class="research-mini-card">

                                <div class="research-mini-icon">
                                    <svg viewBox="0 0 24 24" fill="none"
                                         stroke="currentColor" stroke-width="1.7"
                                         stroke-linecap="round" stroke-linejoin="round">
                                        <rect x="3" y="5" width="18" height="15" rx="2"/>
                                        <path d="M3 10h18M7 5l3 5M14 5l3 5"/>
                                        <path d="m10 13 5 2.5-5 2.5z"/>
                                    </svg>
                                </div>

                                <span class="research-mini-name">
                                    MyDramaList
                                </span>

                                <strong class="research-mini-value">
                                    1,278편
                                </strong>

                                <p>한국 드라마 평점 상위 데이터</p>

                                <small>kdrama.csv · 2022</small>

                            </div>

                            <div class="research-mini-card">

                                <div class="research-mini-icon">
                                    <svg viewBox="0 0 24 24" fill="none"
                                         stroke="currentColor" stroke-width="1.7"
                                         stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M12 7c-2-1.5-5-2-9-1v13c4-1 7-.5 9 1"/>
                                        <path d="M12 7c2-1.5 5-2 9-1v13c-4-1-7-.5-9 1"/>
                                        <path d="M12 7v13"/>
                                    </svg>
                                </div>

                                <span class="research-mini-name">
                                    NAVER WEBTOON
                                </span>

                                <strong class="research-mini-value">
                                    69편
                                </strong>

                                <p>웹툰 원작 정보</p>

                                <small>naver.csv</small>

                            </div>

                            <div class="research-mini-card">

                                <div class="research-mini-icon">
                                    <svg viewBox="0 0 24 24" fill="none"
                                         stroke="currentColor" stroke-width="1.7"
                                         stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7"/>
                                        <path d="M14 3v5h5"/>
                                        <path d="M8 12h5M8 16h3"/>
                                        <circle cx="17" cy="17" r="3"/>
                                        <path d="m19.3 19.3 2 2"/>
                                    </svg>
                                </div>

                                <span class="research-mini-name">
                                    DIRECT RESEARCH
                                </span>

                                <strong class="research-mini-value">
                                    22편
                                </strong>

                                <p>결측치 포함 데이터 수정</p>

                                <small>팀 직접 수집 · 검수</small>

                            </div>

                        </div>

                    </div>

                    <!-- 분석 및 구현 도구 -->
                    <div class="research-group">

                        <div class="research-group-heading">
                            <span>TOOLS &amp; TECHNOLOGY</span>
                            <span class="research-group-line"></span>
                        </div>

                        <div class="research-icon-grid">

                            <div class="research-mini-card research-tool-card">

                                <div class="research-mini-icon">
                                    <svg viewBox="0 0 24 24" fill="none"
                                         stroke="currentColor" stroke-width="1.7"
                                         stroke-linecap="round" stroke-linejoin="round">
                                        <ellipse cx="12" cy="5" rx="8" ry="3"/>
                                        <path d="M4 5v7c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/>
                                        <path d="M4 12v7c0 1.7 3.6 3 8 3s8-1.3 8-3v-7"/>
                                    </svg>
                                </div>

                                <strong class="research-tool-title">
                                    Pandas
                                </strong>

                                <p>데이터 정리 · 분석</p>

                            </div>

                            <div class="research-mini-card research-tool-card">

                                <div class="research-mini-icon">
                                    <svg viewBox="0 0 24 24" fill="none"
                                         stroke="currentColor" stroke-width="1.7"
                                         stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M3 3v18h18"/>
                                        <path d="m6 16 5-5 4 3 5-7"/>
                                        <path d="M17 7h3v3"/>
                                    </svg>
                                </div>

                                <strong class="research-tool-title">
                                    Matplotlib
                                </strong>

                                <p>그래프 시각화</p>

                            </div>

                            <div class="research-mini-card research-tool-card">

                                <div class="research-mini-icon">
                                    <svg viewBox="0 0 24 24" fill="none"
                                         stroke="currentColor" stroke-width="1.7"
                                         stroke-linecap="round" stroke-linejoin="round">
                                        <rect x="2" y="3" width="20" height="18" rx="2"/>
                                        <path d="M2 8h20"/>
                                        <path d="m9 12-3 3 3 3"/>
                                        <path d="m15 12 3 3-3 3"/>
                                        <path d="m13 11-2 8"/>
                                    </svg>
                                </div>

                                <strong class="research-tool-title">
                                    HTML · CSS · JS
                                </strong>

                                <p>발표용 대시보드</p>

                            </div>

                        </div>

                    </div>

                    <!-- 분석 흐름 -->
                    <div class="research-flow">

                        <span>DATA COLLECTION</span>

                        <span class="research-flow-arrow">→</span>

                        <span>ANALYSIS</span>

                        <span class="research-flow-arrow">→</span>

                        <span>VISUALIZATION</span>

                    </div>

                </div>
            </details>

            <!-- 큰 토글 2: 전처리 과정 -->
            <details class="sec-card">
                <summary>
                    <span class="sec-card-kicker">02 · PREPROCESSING</span>
                    <span class="sec-card-title">데이터 전처리 과정</span>
                </summary>
                <div class="sec-card-body">
                    <ol class="sec-list">
                        <li><div>
                            <strong>분석할 수 없는 작품 빼기</strong>
                            <p>평점이 없는 방영 전 · 정보 부족 작품 39편, 같은 드라마가 이름만 바뀌어 두 번 들어간 21편을 제외
                               → 드라마 1,218편</p>
                        </div></li>
                        <li><div>
                            <strong>웹툰 원작 찾기</strong>
                            <p>태그(Adapted From A Webtoon)로 찾고, 위키 목록과 대조해 태그가 빠진 16편을 추가.
                               원작 없는 웹드라마에 잘못 붙은 태그 1편은 제외 → 웹툰 원작 69편</p>
                        </div></li>
                        <li><div>
                            <strong>빈칸 · 이상값 정리</strong>
                            <p>순위 없음(99999)은 빈칸으로, 비어 있던 방송사 14편은 직접 채움(대부분 OTT 오리지널),
                               등급 미정은 가장 흔한 15세로, 빈 장르 1편은 drama로</p>
                        </div></li>
                        <li><div>
                            <strong>조건 칸 만들기</strong>
                            <p>고자극(장르에 액션 · 스릴러 · 호러 · 판타지), OTT 방영(넷플릭스 · TVING · 쿠팡플레이 · 왓챠 등, TV 동시 방영 포함),
                               넷플릭스 방영, 18세 이상 등급, 총 방영 시간(회당 길이 × 회차 수)</p>
                        </div></li>
                        <li><div>
                            <strong>원작 정보 수집 · 합치기</strong>
                            <p>네이버 웹툰 크롤링과 팀 수작업으로 69편의 원작 제목 · 작가 · 플랫폼 · 장르 · 연령 · 평점을 모으고,
                               표기를 통일(예: 전체이용가 → 전체연령가)한 뒤 드라마 영어 제목으로 드라마 표에 붙임</p>
                        </div></li>
                        <li><div>
                            <strong>장르 펼치기 · 저장</strong>
                            <p>한 작품의 여러 장르를 장르마다 한 줄씩 나눈 표를 따로 만들고(장르별 분석용), 정리된 표를 CSV로 저장</p>
                        </div></li>
                    </ol>
                </div>
            </details>
        </section>
        `,
    },
    // 5. 분석 결과 1 (공통 디자인: 그래프 + 설명 칸)
    {
        title: '분석 결과 (원작 유무 차이)',
        html: `
        <section class="sec">
            <p class="sec-kicker">RESULT 01 · WEBTOON OR NOT</p>
            <h2 class="sec-title">웹툰 원작이면 순위가 높을까?</h2>
            <p class="sec-desc">웹툰 원작 드라마와 비원작 드라마의 순위를 비교했습니다.</p>

            <!-- 그래프 1: 비원작 vs 웹툰원작 (matplotlib 그림, newdb/make_base_chart.py로 만듦) -->
            <div class="vc-card">
                <img class="sec-chart-img" src="./pjfile/base_chart.png" alt="비원작 vs 웹툰원작 순위 비교 그래프">
            </div>

            <!-- 그래프 2: 원작 별점 vs 드라마 순위 (팀원이 만든 Plotly 그래프) -->
            <div class="vc-card">
                <iframe class="sec-frame sec-frame-wide" data-src="./pjfile/rating_rank_scatter.html" title="원작 웹툰 별점과 드라마 순위 그래프"></iframe>
            </div>
        </section>
        `,
    },
    // 6. 분석 결과 2
    {
        title: '분석 결과 (세 가지 변인 비교)',
        html: `
            <section class="sec">
                <p class="sec-kicker">RESULT 02 · GENRE</p>
                <h2 class="sec-title">어떤 장르가 강하고, 어떤 장르가 약할까?</h2>
                <p class="sec-desc">웹툰 원작 5편 이상인 장르만 · 막대 = 중앙순위, ○ = 평균순위 · 순위는 전체 드라마 중 상위 몇 %인지로</p>
                <div class="vc-card">
                    <img class="sec-chart-img" src="./pjfile/genre_chart.png" alt="웹툰 원작 장르별 순위 그래프">   <!-- newdb/make_genre_chart.py로 만든 그림 -->


        `,
    },
    // 7. 분석 결과 3
    {
        title: '분석 결과 (변인 추가)',
        html: `
            <section class="sec">
                <p class="sec-kicker">VARIABLE EXPLORER</p>
                <h2 class="sec-title">어떤 조건이 순위를 끌어올릴까?</h2>
                <p class="sec-desc">막대가 높을수록 순위가 높아요. 막대 높이 = 중앙 순위가 전체 드라마 중 상위 몇 %인지</p>
                <div class="vc-card">
                    <div class="vc-modes" id="vcModes"></div>   <!-- [개별] [곱하기] 모드 버튼 자리 -->
                    <div class="vc-chart" id="vcChart"></div>   <!-- 막대들이 솟아오를 자리 (script.js의 initVarChart가 채워요) -->
                    <div class="vc-list" id="vcList" hidden></div>   <!-- 곱하기 모드에서 세 번째 막대를 누르면 작품 목록이 나오는 자리 -->
                    <div class="vc-buttons" id="vcButtons"></div>   <!-- 변수 버튼들이 들어갈 자리 -->
                </div>
            </section>
        `,
    },
    // 8. 분석 결과 4 · 최종 인사이트 (팀원 작업, 기둥을 누르면 아래 설명이 바뀜 → selectResultInsight)
    {
        title: '분석 결과 4 · 최종 인사이트',
        html: `
        <section class="result-final result-clean" aria-label="최종 분석 결과">

            <!-- 01. 상단 제목 -->
            <header class="result-final-head">
                <p class="result-final-kicker">ANALYSIS RESULT · FINAL INSIGHTS</p>
                <h2>웹툰 원작 드라마는 <em>왜 흥행할까?</em></h2>
                <p>기존 드라마와의 비교에서 발견한 세 가지 흥행 경쟁력</p>
            </header>

            <!-- 02. 원기둥 인포그래픽 -->
            <div class="result-final-visual result-clean-visual">
                <div class="result-final-glow" aria-hidden="true"></div>

                <div class="result-clean-visual-head">
                    <span>THREE SUCCESS FACTORS</span>
                    <small>SELECT A FACTOR</small>
                </div>

                <div class="result-final-pillars result-clean-pillars" aria-label="세 가지 흥행 경쟁력">

                    <!-- 01 장르적 차별화 -->
                    <button type="button" class="result-final-pillar is-active" data-result="0" aria-pressed="true"
                        onclick="selectResultInsight(0)"
                        style="--pillar-height:155px;--pillar-color:56,189,248;--pillar-delay:0s">
                        <span class="result-final-float">GENRE</span>
                        <span class="result-final-cylinder">
                            <span class="result-final-cylinder-top"></span>
                            <span class="result-final-cylinder-body"><b>01</b></span>
                            <span class="result-final-cylinder-bottom"></span>
                        </span>
                        <span class="result-final-pillar-title">장르적 차별화</span>
                    </button>

                    <!-- 02 시각적 상상력 -->
                    <button type="button" class="result-final-pillar" data-result="1" aria-pressed="false"
                        onclick="selectResultInsight(1)"
                        style="--pillar-height:185px;--pillar-color:167,139,250;--pillar-delay:.1s">
                        <span class="result-final-float">VISUAL</span>
                        <span class="result-final-cylinder">
                            <span class="result-final-cylinder-top"></span>
                            <span class="result-final-cylinder-body"><b>02</b></span>
                            <span class="result-final-cylinder-bottom"></span>
                        </span>
                        <span class="result-final-pillar-title">시각적 상상력</span>
                    </button>

                    <!-- 03 OTT와 장르의 결합 -->
                    <button type="button" class="result-final-pillar" data-result="2" aria-pressed="false"
                        onclick="selectResultInsight(2)"
                        style="--pillar-height:215px;--pillar-color:45,212,191;--pillar-delay:.2s">
                        <span class="result-final-float">OTT</span>
                        <span class="result-final-cylinder">
                            <span class="result-final-cylinder-top"></span>
                            <span class="result-final-cylinder-body"><b>03</b></span>
                            <span class="result-final-cylinder-bottom"></span>
                        </span>
                        <span class="result-final-pillar-title">OTT와 장르의 결합</span>
                    </button>

                </div>

                <p class="result-final-visual-note">※ 기둥 높이는 실제 수치가 아닌 설명용 연출입니다.</p>
            </div>

            <!-- 03. 기둥을 누르면 바뀌는 설명 (글은 script.js 맨 끝 selectResultInsight 안의 insights 목록) -->
            <div class="result-final-detail result-clean-detail" aria-live="polite">
                <div>
                    <span class="result-final-detail-tag" id="resultInsightTag">FINDING 01 · GENRE</span>
                    <h3 id="resultInsightTitle">기존 드라마와 차별화된 장르적 경쟁력</h3>
                </div>
                <p id="resultInsightText">
                    웹툰 원작 드라마는 독창적인 소재와 사건 중심의 전개를 통해 기존 드라마와 차별성을 보여주었으며,
                    특히 공포·액션·스릴러·판타지 등 고자극 장르에서 상대적으로 높은 흥행 성과가 관찰되었다.
                </p>
            </div>

            <!-- 04. 최하단 KEY MESSAGE -->
            <div class="result-final-conclusion result-clean-conclusion">
                <span>KEY MESSAGE</span>
                <h3>흥행의 차이는 <em>원작의 인기만이 아니라,</em><br>콘텐츠의 개성과 유통 환경의 결합에서 나타났다.</h3>
                <p>웹툰의 장르적 다양성과 독창적인 세계관이 OTT 플랫폼과 만나 새로운 흥행 가능성을 보여주었다.</p>
            </div>

        </section>
        `,
    },
    // 9. 한계 및 후속 연구 (공통 디자인)
    {
        title: '한계 및 후속 연구',
        html: `
        <section class="sec">
            <p class="sec-kicker">LIMITATIONS &amp; NEXT STEPS</p>
            <h2 class="sec-title">이번 분석이 말하지 못한 것</h2>
            <p class="sec-desc">결과를 어디까지 믿을 수 있는지 정리하고, 다음에 확인해 볼 질문을 남깁니다.</p>

            <!-- 큰 토글 1: 한계 -->
            <details class="sec-card">
                <summary>
                    <span class="sec-card-kicker">01 · LIMITATIONS</span>
                    <span class="sec-card-title">분석의 한계</span>
                </summary>
                <div class="sec-card-body">
                    <ol class="sec-list">
                        <li><div>
                            <strong>흥행 지표가 해외 이용자 평가 중심</strong>
                            <p>순위는 MyDramaList 이용자 평점으로 매겨져 국내 시청률이나 조회수와 다를 수 있습니다.
                               평가 인원이 적은 작품은 순위가 수만 위로 밀려(예: 며느라기, 동네변호사 조들호2) 평균이 크게 왜곡되기 때문에 중앙 순위를 중심으로 봤습니다.</p>
                        </div></li>
                        <li><div>
                            <strong>작은 표본과 통계 검정의 부족</strong>
                            <p>웹툰 원작은 69편이고, 조건을 겹치면 10편 안팎까지 줄어듭니다.
                               대부분의 비교는 통계 검정 없이 중앙 순위만 비교했기 때문에, 결과는 인과가 아닌 경향으로 해석해야 합니다.</p>
                        </div></li>
                        <li><div>
                            <strong>서로 겹치는 조건들</strong>
                            <p>고자극 · OTT · 넷플릭스 · 19세 · 신입 감독은 같은 작품에 함께 나타나는 경우가 많습니다.
                               어느 조건이 순위를 끌어올렸는지 하나씩 떼어 내 확인하지는 못했고, 최근 작품일수록 OTT가 많아지는 시기 효과도 섞여 있을 수 있습니다.</p>
                        </div></li>
                        <li><div>
                            <strong>데이터 수집의 한계</strong>
                            <p>웹툰 원작 여부는 사이트 태그를 기준으로 해 누락이 있을 수 있고, 장르는 작품마다 최대 4개까지만 붙어 있습니다.
                               원작 평점은 대부분 9.8~10점에 몰려 있으며, 웹툰 연재 시작일은 플랫폼 재등록일일 수 있습니다.
                               감독 경력은 데이터 안의 연출 편수로 정해 이후 작품까지 함께 세어졌습니다.</p>
                        </div></li>
                        <li><div>
                            <strong>2022년까지의 데이터</strong>
                            <p>2023년 이후 작품은 포함되지 않아, 최근 OTT 오리지널 시장의 변화는 반영하지 못했습니다.</p>
                        </div></li>
                    </ol>
                </div>
            </details>

            <!-- 큰 토글 2: 후속 연구 -->
            <details class="sec-card">
                <summary>
                    <span class="sec-card-kicker">02 · FURTHER RESEARCH</span>
                    <span class="sec-card-title">후속 연구 및 가설</span>
                </summary>
                <div class="sec-card-body">
                    <p class="sec-label">NEXT HYPOTHESIS</p>
                    <ol class="sec-list">
                        <li><div><strong>OTT 시청층은 기존 TV 시청층보다 젊을 것이다.</strong></div></li>
                        <li><div><strong>젊은 시청층일수록 고자극 장르를 선호할 것이다.</strong></div></li>
                        <li><div><strong>웹툰에는 고자극 장르로 각색할 만한 소재가 풍부할 것이다.</strong></div></li>
                    </ol>
                </div>
            </details>
        </section>
        `,
    },
    // 10. 마무리
    {
        title: '마무리',
        html: `
            <section class="ending-page" aria-label="프로젝트 마무리">
                <div class="ending-hero">
                    <div class="ending-copy">
                        <p class="ending-kicker">FINAL EPISODE · TEAM 이김²</p>
                        <h2 class="ending-title">이야기의 시작은 웹툰,<br><span>성공의 이유는 데이터.</span></h2>
                        <p class="ending-description">웹툰 원작 드라마의 성공 요인을 데이터로 살펴보았습니다.<br>원작 여부와 OTT 플랫폼, 장르의 관계를 분석한 이김²팀의 프로젝트입니다.</p>
                        <div class="ending-rule"></div>
                        <p class="ending-thanks">이상 이김²팀이었습니다.</p>
                        <p class="ending-subthanks">끝까지 함께해 주셔서 감사합니다.</p>
                        <button type="button" class="ending-replay" onclick="selectItem(1)">▶ &nbsp; 처음부터 다시 보기</button>
                    </div>
                    <div class="ending-art" aria-label="분석 작품 포스터 모음">
                        <img src="./pjfile/pair_약한영웅.png" alt="약한영웅 웹툰과 드라마" class="ending-poster ending-poster-1">
                        <img src="./pjfile/pair_DP.png" alt="D.P. 웹툰과 드라마" class="ending-poster ending-poster-2">
                        <img src="./pjfile/pair_스위트홈.png" alt="스위트홈 웹툰과 드라마" class="ending-poster ending-poster-3">
                        <img src="./pjfile/pair_지금우리학교는.png" alt="지금 우리 학교는 웹툰과 드라마" class="ending-poster ending-poster-4">
                        <img src="./pjfile/pair_여신강림.png" alt="여신강림 웹툰과 드라마" class="ending-poster ending-poster-5">
                    </div>
                </div>
                <div class="ending-footer">
                    <p>WEBTOON × DRAMA · DATA ANALYSIS PROJECT <span>© TEAM 이김² · 2026</span></p>
                    <details class="ending-references">
                        <summary>REFERENCES <span aria-hidden="true">↗</span></summary>
                        <div class="ending-reference-content">
                            <h3>참고문헌 및 자료 출처</h3>
 <ul>
                    <li>드라마 데이터 출처 : https://www.kaggle.com/datasets/iphigeniebera/korean-drama-list-about-740-unique-dramas</li>
                    <li>데이터 작성자 : Iphigenie Bera</li>
                    <li>데이터 수집 방법 : 위키피디아, mydramalist, IMDb 웹사이트 웹스크래핑</li>                    
                    <li>웹툰 데이터 출처 : https://www.naver.com</li>
                    <li>데이터 작성자 : 김고요</li>
                    <li>데이터 수집 방법 : 네이버 웹 크롤링</li>
                    <li>아이콘 일러스트 출처</li>
                    <li>왓챠 : https://watcha.team/af019cba-e6d6-4232-b395-a2a300a71fb6</li>
                        <li>넷플릭스 : https://icon-icons.com/ko/icon/netflix/161073#google_vignette</li>
                        <li>티빙 : https://ko.wikipedia.org/wiki/%ED%8C%8C%EC%9D%BC:TVING.png</li>
                        <li>네이버웹툰 :https://about.webtoon.com/media-kit/product</li>
                        <li>카카오페이지 : https://commons.wikimedia.org/wiki/File:Kakao_page_logo.png</li>
                        <li>레진코믹스 : https://brandfetch.com/lezhin.com</li>
                        <li>웨이브 로고 : https://semologo.com/brand/wavve/</li>
                        <li>디즈니플러스 : Icons8.com</li>
            
            
            
            
            

                            </ul>
                        </div>
                    </details>
                </div>
            </section>
        `,
    },
];


/* ---------------------------------------------------------
   5. 기차 끝없이 이어 붙이기
   - 10번 카드 뒤에 1~5번 카드의 "쌍둥이"를 붙여 둬요.
   - 그래서 10번 다음에 1번이 바로 이어서 오는 것처럼 보여요.
   - 쌍둥이 카드를 눌러도 진짜 카드와 똑같이 열려요.
   --------------------------------------------------------- */
document.querySelectorAll('.card').forEach((card, i) => {
    if (i <= visibleCards) {                  // 앞에서부터 5장만
        const twin = card.cloneNode(true);    // 똑같이 생긴 쌍둥이를 만들고
        twin.classList.add('clone');          // "나는 쌍둥이야" 이름표를 붙이고
        cardTrackEl.appendChild(twin);        // 기차 맨 뒤에 태워요
    }
});


/* ---------------------------------------------------------
   6. 기차를 원하는 자리로 옮기기
   - index: 몇 번째 카드가 맨 왼쪽에 오게 할지
   - animate: true면 스르륵, false면 눈 깜짝할 새 순간이동
   --------------------------------------------------------- */
function trackPosition(index) {
    // 카드 한 장이 차지하는 길이 = 화면의 1/4 + 빈칸의 1/4
    return `translateX(calc(${-index * (100 / visibleCards)}% - ${index * CARD_GAP / visibleCards}px))`;
}

function moveTrack(index, animate) {
    cardTrackEl.style.transition = animate ? '' : 'none';   // 스르륵 할지 말지 정하고
    cardTrackEl.style.transform = trackPosition(index);     // 기차를 그 자리로 보내요
    if (!animate) void cardTrackEl.offsetWidth;             // 순간이동이 진짜 끝났다고 브라우저에게 확인 도장 받기
}


/* ---------------------------------------------------------
   7. 화살표 버튼
   - 오른쪽 화살표(1): 다음 카드가 맨 왼쪽에 오도록 한 칸 가요.
   - 왼쪽 화살표(-1): 이전 카드가 맨 왼쪽에 오도록 한 칸 돌아와요.
   --------------------------------------------------------- */
function slideCards(direction) {
    if (isSliding) return;    // 이미 움직이는 중이면 기다려요
    isSliding = true;

    if (direction > 0) {
        // 다음 칸으로: 지금 칸을 내림한 다음 +1
        currentIndex = Math.floor(currentIndex + 0.001) + 1;
    } else {
        // 맨 앞에서 왼쪽으로 가려고 하면, 똑같이 생긴 쌍둥이 자리로 몰래 순간이동부터 해요
        if (currentIndex < 0.001) {
            currentIndex = totalCards;
            moveTrack(currentIndex, false);
        }
        // 이전 칸으로: 지금 칸을 올림한 다음 -1
        currentIndex = Math.ceil(currentIndex - 0.001) - 1;
    }

    moveTrack(currentIndex, true);
    updateRangeIndicator();

    // 0.35초 뒤(움직임이 끝나면)
    setTimeout(() => {
        // 쌍둥이 자리까지 왔으면, 진짜 카드 자리로 몰래 순간이동해요 (똑같이 생겨서 아무도 몰라요)
        if (currentIndex >= totalCards) {
            currentIndex -= totalCards;
            moveTrack(currentIndex, false);
        }
        isSliding = false;
    }, 350);
}


/* ---------------------------------------------------------
   8. 오른쪽 위 "목차 1 ~ 4 표시 중" 글자 바꾸기
   --------------------------------------------------------- */
function updateRangeIndicator() {
    const first = Math.round(currentIndex) % totalCards;            // 맨 왼쪽 카드 (10번 다음은 다시 1번)
    const startNum = first + 1;
    const endNum = (first + visibleCards - 1) % totalCards + 1;     // 맨 오른쪽 카드
    document.getElementById('rangeIndicator').innerText = `목차 ${startNum} ~ ${endNum} 표시 중`;
}


/* ---------------------------------------------------------
   9. 기차가 혼자 천천히 지나가기 (자동 롤링)
   - 화면을 새로 그릴 때마다(1초에 약 60번) 아주 조금씩 움직여요.
   - 이럴 때는 멈춰요:
     · 설명을 펼쳐 보고 있을 때
     · 카드가 모이는 중일 때
     · 화살표로 움직이는 중일 때
     · 마우스가 카드 위에 있을 때 (누르려는 카드가 도망가지 않게)
   --------------------------------------------------------- */
const sliderArea = document.querySelector('.slider-wrapper');
sliderArea.addEventListener('mouseenter', () => isHovering = true);    // 마우스가 들어오면 멈춤
sliderArea.addEventListener('mouseleave', () => isHovering = false);   // 마우스가 나가면 다시 출발

let lastTime = null;   // 지난번에 그린 시각

function roll(time) {
    const isBusy = mainEl.classList.contains('opened') || mainEl.classList.contains('gathering')
                || document.body.classList.contains('home-mode');   // 홈 화면일 때도 쉬어요

    if (lastTime !== null && !isBusy && !isSliding && !isHovering) {
        // 지난번 이후 흐른 시간만큼만 앞으로 가요 (컴퓨터가 빠르든 느리든 같은 속도)
        const cardStep = (cardTrackEl.parentElement.offsetWidth + CARD_GAP) / visibleCards;   // 카드 한 칸의 길이(px)
        currentIndex += CARD_SPEED * (time - lastTime) / 1000 / cardStep;              // 흐른 시간 동안 간 거리 ÷ 한 칸 길이 = 간 칸 수
        if (currentIndex >= totalCards) currentIndex -= totalCards;   // 한 바퀴 돌면 처음으로

        cardTrackEl.style.transition = 'none';
        cardTrackEl.style.transform = trackPosition(currentIndex);
        updateRangeIndicator();
    }

    lastTime = time;
    requestAnimationFrame(roll);   // 다음 그림 그릴 때 또 불러 줘
}

requestAnimationFrame(roll);       // 출발!


/* ---------------------------------------------------------
   10. 카드를 눌렀을 때 (상단 목차 글자를 눌러도 똑같아요)
   - 처음 누르면: 카드가 모였다가 → 왼쪽에 줄 서고 → 오른쪽에 설명이 나와요.
   - 설명이 열린 채로 다른 카드를 누르면: 설명만 옆으로 슥 바뀌어요.
   - 같은 카드를 또 누르면: 설명이 닫혀요.
   --------------------------------------------------------- */
function selectItem(num) {
    // 같은 카드를 또 눌렀으면 닫고 끝
    if (openedNum === num) {
        closeDetail();
        return;
    }

    leaveHome();   // 홈 화면이었다면 닫고 카드 화면으로

    const prevNum = openedNum;   // 바뀌기 전에 보고 있던 번호 (0이면 아무것도 안 보고 있었음)
    openedNum = num;

    // 설명 상자에 이번 목차의 제목과 내용을 채워요
    const page = PAGES[num - 1];   // 1번 목차는 PAGES의 0번 칸에 있어요
    detailTitle.innerText = page.title;
    detailContent.innerHTML = page.html;
    if (document.getElementById('vcChart')) initVarChart();   // 그래프 자리가 있는 목차면 막대 세우기
    loadFramesOnOpen();                                        // 토글 안 그래프는 열 때 불러오기

    detailBox.classList.remove('closing');   // 사라지는 중이었으면 멈추게 해요

    if (prevNum === 0) {
        // 처음 여는 거면: 카드를 먼저 모으고, 다 모이면 줄 세우고 설명을 보여 줘요
        gatherCards();
        setTimeout(() => {
            if (openedNum === 0) return;          // 그 사이에 닫았으면 아무것도 안 해요
            mainEl.classList.add('opened');       // 왼쪽 줄 서기 모양으로 바꾸고 (순서 중요: 이게 먼저)
            resetCards();                         // 모였던 카드를 풀어요
            detailBox.style.display = 'block';    // 설명 상자를 보여 줘요
            loadVisibleFrames();                  // 이제 보이니까 그래프 액자 불러오기
        }, GATHER_TIME);
    } else {
        // 이미 열려 있었으면: 설명 상자가 옆에서 슥 들어오게 해요
        detailBox.style.display = 'block';
        loadVisibleFrames();                      // 그래프 액자 불러오기
        detailBox.classList.remove('slide-left', 'slide-right');
        void detailBox.offsetWidth;   // 같은 움직임을 처음부터 다시 하라고 브라우저에게 알려 줘요
        // 뒤 번호로 가면 오른쪽에서, 앞 번호로 가면 왼쪽에서 들어와요
        detailBox.classList.add(num > prevNum ? 'slide-left' : 'slide-right');
    }

    updateActiveStates(num);
}


/* ---------------------------------------------------------
   11. 지금 보고 있는 카드와 상단 목차 글자에 불 켜기
   --------------------------------------------------------- */
function updateActiveStates(num) {
    // 카드: 쌍둥이 카드도 같이 불이 켜지도록 10으로 나눈 나머지로 비교해요 (11번째 = 1번의 쌍둥이)
    document.querySelectorAll('.card').forEach((card, index) => {
        card.classList.toggle('active', index % totalCards === num - 1);
    });

    // 상단 목차 글자
    document.querySelectorAll('.top-nav a').forEach((link, index) => {
        link.classList.toggle('active', index === num - 1);
    });
}


/* ---------------------------------------------------------
   12. 설명 닫기 (× 버튼, 또는 같은 카드를 한 번 더 눌렀을 때)
   - 설명 상자가 아래로 흐려지며 사라진 뒤, 카드가 다시 기차가 돼요.
   --------------------------------------------------------- */
function closeDetail() {
    openedNum = 0;   // "아무것도 안 보고 있어요"라고 적어 둬요

    detailBox.classList.remove('slide-left', 'slide-right');
    detailBox.classList.add('closing');   // 흐려지며 사라지는 움직임 시작

    // 0.3초 뒤(다 사라지면)
    setTimeout(() => {
        if (openedNum === 0) {                     // 그 사이에 다른 카드를 누르지 않았다면
            detailBox.style.display = 'none';      // 설명 상자를 치우고
            mainEl.classList.remove('opened');     // 카드를 다시 기차 모양으로
        }
        detailBox.classList.remove('closing');
    }, 300);

    // 불 다 끄기
    document.querySelectorAll('.card').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.top-nav a').forEach(a => a.classList.remove('active'));
}


/* ---------------------------------------------------------
   13. 카드 모으기 (카드 뭉치 만들기)
   - 화면에 보이던 카드들이 왼쪽 끝으로 미끄러지면서
     작아지고, 차곡차곡 겹쳐서 한 뭉치가 돼요.
   - 뭉치 크기는 왼쪽 줄 서기 카드 한 장과 똑같아요.
   --------------------------------------------------------- */
function gatherCards() {
    const cards = document.querySelectorAll('.card');

    // 모이는 동안 카드 크기와 기차 위치가 흔들리지 않게, 지금 모습 그대로 꽉 붙잡아 둬요
    cardTrackEl.style.transition = 'none';
    cardTrackEl.style.transform = `translateX(${-currentIndex * (cardTrackEl.offsetWidth + CARD_GAP) / visibleCards}px)`;
    cards.forEach(card => card.style.flexBasis = card.offsetWidth + 'px');

    const startX = document.querySelector('.card-container').getBoundingClientRect().left;   // 뭉치가 모일 자리 = 카드 칸의 왼쪽 끝
    const scale = SIDEBAR_WIDTH / cards[0].offsetWidth;   // 카드를 몇 배로 줄여야 줄 서기 카드 너비가 되는지
    mainEl.style.setProperty('--s', scale);               // 그 숫자를 style.css에게도 알려 줘요

    const first = Math.floor(currentIndex);   // 지금 맨 왼쪽에 걸쳐 있는 카드 번호

    // 1) 먼저 모든 카드의 위치를 재서 적어 둬요 (움직이기 전에 줄자로 한 번에 다 재기)
    //    중간에 다시 재면 브라우저가 앞 카드를 기본 속도(0.2초)로 먼저 출발시켜 버려요
    const lefts = [...cards].map(card => card.getBoundingClientRect().left);

    // 2) "지금 모이는 중" 이름표를 먼저 붙여요 → 이제 style.css에 적은 느린 시간이 적용돼요
    mainEl.classList.add('gathering');

    // 3) 적어 둔 위치로 계산해서 카드를 움직여요
    cards.forEach((card, i) => {
        const order = i - first;                                  // 보이는 카드 중 몇 번째인지 (0, 1, 2…)
        const isVisible = order >= 0 && order <= visibleCards;    // 지금 화면에 보이는 카드인지 (걸쳐 보이면 5장)
        const moveX = startX - lefts[i] + order * 3;              // 왼쪽 끝까지 가는 거리 (3px씩 비켜 쌓기)

        card.style.transform = `translateX(${moveX}px) scale(${scale})`;
        card.style.transitionDelay = isVisible ? `${order * 0.03}s` : '0s';   // 앞 카드부터 차례로 출발
        card.style.opacity = isVisible ? '' : '0';    // 안 보이던 카드는 그냥 스르륵 사라져요
        card.style.zIndex = 50 - i;                    // 앞 번호 카드가 맨 위에 올라가요
        card.style.setProperty('--i', i);              // 나중에 줄 설 때 몇 번째 자리인지 적어 둬요
    });
}


/* ---------------------------------------------------------
   14. 모였던 카드 풀기
   - 카드에 붙여 뒀던 메모(위치, 크기 등)를 다 떼서 원래대로 돌려놔요.
   --------------------------------------------------------- */
function resetCards() {
    // "모이는 중" 이름표를 제일 먼저 떼요.
    // (늦게 떼면 모일 때 쓰던 느린 움직임이 남아서, 사이드바 아이콘·글자가 커졌다가 줄어들어 보여요)
    mainEl.classList.remove('gathering');
    document.querySelectorAll('.card').forEach(card => {
        card.style.transform = '';
        card.style.transitionDelay = '';
        card.style.opacity = '';
        card.style.zIndex = '';
        card.style.flexBasis = '';
    });
    moveTrack(currentIndex, false);          // 기차도 원래 자리로
}


/* ---------------------------------------------------------
   15. 웹툰·드라마 포스터 띠
   - 웹툰 그림 5장이 줄지어 흘러가요.
   - 마우스를 올리면 마우스 주변만 드라마 포스터가 보여요. (컷 → 씬, 돋보기처럼)
   --------------------------------------------------------- */

// 컷 → 씬 그림 하나를 만드는 함수 (다른 곳에서도 다시 쓸 수 있어요)
// cut: 웹툰 그림 경로, scene: 드라마 포스터 경로, name: 작품 이름
function makeCutToScene(cut, scene, name) {
    return `
        <div class="c2s">
            <img class="c2s-cut"   src="${cut}"   alt="${name} 웹툰">
            <img class="c2s-scene" src="${scene}" alt="${name} 드라마 포스터">
        </div>
    `;
}

// 마우스가 컷 → 씬 그림 위에서 움직이면, 그림 안에서 마우스가 어디 있는지 알려 줘요
// (페이지 어디에 있는 그림이든 저절로 동작해서, 다른 곳에 다시 써도 따로 할 일이 없어요)
document.addEventListener('mousemove', (e) => {
    const box = e.target.closest('.c2s');
    if (!box) return;
    const rect = box.getBoundingClientRect();
    box.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    box.style.setProperty('--my', `${e.clientY - rect.top}px`);
});

const PAIRS = [
    { name: '유미의 세포들',    cut: './pjfile/webtoon_유미의세포들.png',   scene: './pjfile/유미의세포들포스터.png' },
    { name: 'D.P.',             cut: './pjfile/webtoon_DP.jpg',             scene: './pjfile/디피포스터.png' },
    { name: '스위트홈',         cut: './pjfile/webtoon_스위트홈.jpg',       scene: './pjfile/스위트홈포스터.png' },
    { name: '지금 우리 학교는', cut: './pjfile/webtoon_지금우리학교는.jpg', scene: './pjfile/지금우리학교는포스터.png' },
    { name: '여신강림',         cut: './pjfile/webtoon_여신강림.jpg',       scene: './pjfile/여신강림포스터.png' },
    { name: '미생',             cut: './pjfile/webtoon_미생.png',           scene: './pjfile/미생포스터.png' },
    { name: '약한영웅',         cut: './pjfile/webtoon_약한영웅.jpg',       scene: './pjfile/약한영웅포스터.png' },
    { name: '가우스전자',       cut: './pjfile/webtoon_가우스전자.png',     scene: './pjfile/가우스전자포스터.png' },
    { name: '김부장',           cut: './pjfile/webtoon_김부장.png',         scene: './pjfile/김부장포스터.png' },
    { name: '취사병',           cut: './pjfile/webtoon_취사병.png',         scene: './pjfile/취사병포스터.png' },
    { name: '이태원 클라쓰',    cut: './pjfile/webtoon_이태원클라쓰.png',   scene: './pjfile/이태원클라쓰포스터.png' },
];

const posterTrackEl = document.getElementById('posterTrack');   // 포스터들이 올라탈 기차

// 목록을 두 번 이어 붙여서(12장 + 쌍둥이 12장) 카드를 만들어 기차에 태워요
// 앞 12장과 뒤 12장이 똑같아서, 끝까지 가면 처음으로 이음매 없이 돌아가요
[...PAIRS, ...PAIRS].forEach(pair => {
    posterTrackEl.insertAdjacentHTML('beforeend', `
        <figure class="poster-pair">
            ${makeCutToScene(pair.cut, pair.scene, pair.name)}
            <figcaption>${pair.name}</figcaption>
        </figure>
    `);
});

// 포스터 기차 속도를 위 목차 기차와 똑같이 맞추기
// 포스터 기차는 "목록 한 바퀴 길이"를 한 바퀴로 도니까, 걸리는 시간 = 5장 길이 ÷ 1초에 가는 거리
function syncPosterSpeed() {
    const loopLength = posterTrackEl.scrollWidth / 2;                  // 목록 한 바퀴 길이(px)
    posterTrackEl.style.animationDuration = `${loopLength / ROLL_SPEED}s`;
}
syncPosterSpeed();
window.addEventListener('resize', syncPosterSpeed);   // 창 크기가 바뀌면 다시 맞추기


/* ---------------------------------------------------------
   16. 홈 화면
   - 처음 열면 가운데에 제목만 떠 있어요. (body에 home-mode 이름표)
   - 홈 화면을 누르거나 상단 목차를 누르면 → 카드 화면으로
   - 왼쪽 위 팀 이름을 누르면 → 다시 홈 화면으로
   --------------------------------------------------------- */
function leaveHome() {
    if (!document.body.classList.contains('home-mode')) return;   // 이미 카드 화면이면 할 일 없음
    document.body.classList.remove('home-mode');
    syncPosterSpeed();   // 숨어 있던 포스터 띠가 이제 보이니까 길이를 다시 재서 속도 맞추기
}

// 홈 화면 제목 속 그림 띠를 오른쪽으로 천천히 흘려요 (포스터 띠와 같은 속도)
let stripX = 0;            // 띠가 지금까지 움직인 거리(px)
let stripLastTime = null;
function flowHomeStrip(time) {
    if (stripLastTime !== null && document.body.classList.contains('home-mode')) {
        stripX += ROLL_SPEED * (time - stripLastTime) / 1000;
        document.getElementById('homeTitle').style.backgroundPositionX = `${stripX}px`;
    }
    stripLastTime = time;
    requestAnimationFrame(flowHomeStrip);
}
requestAnimationFrame(flowHomeStrip);

function goHome() {
    if (openedNum !== 0) closeDetail();          // 설명이 열려 있으면 닫고
    document.body.classList.add('home-mode');    // 홈 화면으로
}


/* ---------------------------------------------------------
   16. 변수 탐색 그래프 (분석 결과 3)
   - 재료: chart_data.js의 CHART_DATA (newdb/make_chart_data.py로 만듦)
   - 막대 높이 = 중앙 순위가 전체 드라마 중 "상위 몇 %"인지 → 높을수록 좋은 순위
   --------------------------------------------------------- */

// 숫자 목록의 가운데 값 (중앙값)
function median(list) {
    const nums = list.filter(n => n !== null).sort((a, b) => a - b);
    const mid = Math.floor(nums.length / 2);
    return nums.length % 2 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
}

// 순위 → "상위 몇 %" (전체 1,202편을 줄 세운 줄자에서 몇 번째쯤인지)
function toTopPercent(rank) {
    const ranks = CHART_DATA.all_ranks;
    const better = ranks.filter(r => r < rank).length;   // 나보다 순위가 높은 드라마 수
    return better / ranks.length * 100;
}

// 막대 하나 만들기 (이름, 중앙 순위, 편수, 색 이름표)
function makeBar(label, rank, count, colorClass) {
    const bar = document.createElement('div');
    bar.className = 'vc-bar ' + colorClass;
    bar.innerHTML = `
        <span class="vc-value"></span>
        <div class="vc-track"><div class="vc-pillar"></div></div>   <!-- 막대가 자라는 투명한 기둥 자리 -->
        <span class="vc-label"></span>
        <span class="vc-meta"></span>
    `;
    // 처음엔 높이 0 → 다음 장면에서 진짜 높이로 바꾸면 스르륵 솟아올라요
    requestAnimationFrame(() => requestAnimationFrame(() => updateBar(bar, label, rank, count)));
    return bar;
}

// 이미 서 있는 막대의 글자와 높이 바꾸기 (곱하기 모드에서 세 번째 막대가 쑥 커지거나 줄어듦)
function updateBar(bar, label, rank, count) {
    bar.querySelector('.vc-label').textContent = label;
    bar.classList.toggle('vc-small', count < 5);          // 5편 미만이면 흐리게 (표본 작음)
    if (count === 0) {                                    // 조건을 다 만족하는 작품이 없을 때
        bar.querySelector('.vc-value').textContent = '해당 없음';
        bar.querySelector('.vc-meta').textContent = '0편';
        bar.querySelector('.vc-pillar').style.height = '0';
        bar.dataset.top = 100;   // 0편은 정렬할 때 맨 낮은 막대로
        return;
    }
    const top = toTopPercent(rank);
    bar.dataset.top = top;   // 정렬할 때 쓰려고 상위 %를 막대에 적어 둬요
    bar.querySelector('.vc-value').textContent = `상위 ${top.toFixed(0)}%`;
    bar.querySelector('.vc-meta').textContent = `중앙 ${Math.round(rank).toLocaleString()}위 · ${count}편`;
    bar.querySelector('.vc-pillar').style.height = (100 - top) + '%';   // 상위 10%면 막대 90% 높이
}

// 막대를 바닥으로 줄인 뒤 지우기
function removeBar(bar) {
    bar.querySelector('.vc-pillar').style.height = '0';
    bar.classList.add('leaving');
    setTimeout(() => bar.remove(), VC_BAR_TIME);
}

// 변수 버튼 줄: [줄 이름, 이 줄에 들어갈 짝 목록]
// 짝(pair)이 같으면 곱하기 모드에서 둘 중 하나만 고를 수 있어요. 고자극은 로맨스와 같은 줄이지만 짝은 따로라 같이 고를 수 있어요
const VC_ROWS = [
    ['원작 평점', ['power']],
    ['장르', ['romance', 'stim']],
    ['편성 요일', ['weekend']],
    ['방송사', ['network']],
    ['넷플릭스', ['netflix']],
    ['해외 유통', ['viki']],
    ['등급', ['r18']],
    ['방영 시간', ['runtime']],
    ['원작 플랫폼', ['platform']],
    ['원작 공개 기간', ['open']],
    ['감독', ['director']],
];
const VC_BAR_TIME = 800;   // 막대가 솟거나 꺼지는 시간 (style.css의 .vc-pillar transition 0.8s와 짝)

let vcMode = 'single';     // 'single' = 개별 모드, 'multi' = 곱하기 모드
let vcPicked = [];         // 곱하기 모드에서 지금 겹쳐 놓은 변수들 (순서대로)
let vcListOpen = false;    // 곱하기 모드 작품 목록이 열려 있는지

// 그래프 처음 그리기: 기본 막대 2개 (비원작 전체, 웹툰원작 전체) + 모드 버튼 + 변수 버튼
function initVarChart() {
    const chart = document.getElementById('vcChart');
    const base = CHART_DATA.base;
    chart.innerHTML = '';
    chart.appendChild(makeBar('비원작 전체',   base['비원작 전체'].median,   base['비원작 전체'].count,   'vc-gray'));
    chart.appendChild(makeBar('웹툰원작 전체', base['웹툰원작 전체'].median, base['웹툰원작 전체'].count, 'vc-blue'));
    vcMode = 'single';
    vcPicked = [];
    vcListOpen = false;
    renderList();
    makeModeButtons();
    makeVarButtons();
}

// 웹툰 원작 중 고른 변수들에 모두 해당하는 작품만 골라서 순위 계산
function groupOf(keys) {
    const picked = CHART_DATA.dramas.filter(d => keys.every(k => d[k]));
    const ranks = picked.map(d => d.rank).filter(r => r !== null);
    const dramas = picked.filter(d => d.rank !== null).sort((a, b) => a.rank - b.rank);   // 순위 좋은 작품부터
    return { count: ranks.length, median: median(ranks), dramas: dramas };
}

// [개별] [곱하기] 모드 버튼
function makeModeButtons() {
    const box = document.getElementById('vcModes');
    box.innerHTML = `
        <button class="vc-mode on" data-mode="single">개별</button>
        <button class="vc-mode" data-mode="multi">곱하기</button>
        <span class="vc-mode-help">변수를 누를 때마다 막대가 하나씩 추가돼요</span>
        <span class="vc-single-tools" id="vcSingleTools">   <!-- 개별 모드에서만 보여요 -->
            <button class="vc-all" data-sort="desc">내림차순</button>   <!-- 높은 막대(순위 좋은 것)부터 -->
            <button class="vc-all" data-sort="asc">오름차순</button>    <!-- 낮은 막대부터 -->
            <button class="vc-all" id="vcAll">전체 선택</button>
        </span>
    `;
    box.querySelectorAll('[data-sort]').forEach(btn => {
        btn.onclick = () => sortBars(btn.dataset.sort);
    });
    box.querySelectorAll('.vc-mode').forEach(btn => {
        btn.onclick = () => setMode(btn.dataset.mode);
    });
    document.getElementById('vcAll').onclick = selectAll;
}

// 개별 모드 전체 선택: 안 켜진 변수를 전부 켜요. 이미 다 켜져 있으면 전부 끄기
function selectAll() {
    const buttons = [...document.querySelectorAll('.vc-btn')];
    const allOn = buttons.every(b => b.classList.contains('on'));
    buttons.forEach(btn => {
        const v = CHART_DATA.variables.find(o => o.key === btn.dataset.key);
        if (allOn || !btn.classList.contains('on')) toggleVar(v, btn);   // 켜진 건 그대로 두고 꺼진 것만 누르기
    });
    updateAllButton();
}

// 전체 선택 버튼 글자 바꾸기 (다 켜져 있으면 '전체 해제')
function updateAllButton() {
    const all = document.getElementById('vcAll');
    if (!all) return;
    const allOn = [...document.querySelectorAll('.vc-btn')].every(b => b.classList.contains('on'));
    all.textContent = allOn ? '전체 해제' : '전체 선택';
}

// 모드 바꾸기: 기본 막대 2개만 남기고 다 지운 뒤 새로 시작
function setMode(mode) {
    if (mode === vcMode) return;
    vcMode = mode;
    vcPicked = [];
    vcListOpen = false;
    renderList();
    document.querySelectorAll('.vc-mode').forEach(b => b.classList.toggle('on', b.dataset.mode === mode));
    document.querySelector('.vc-mode-help').textContent = mode === 'single'
        ? '변수를 누를 때마다 막대가 하나씩 추가돼요'
        : '세 번째 막대 하나에 변수가 겹쳐져요 (같은 줄에서는 하나만)';
    document.querySelectorAll('.vc-btn.on').forEach(b => b.classList.remove('on'));
    document.querySelectorAll('#vcChart .vc-var').forEach(removeBar);
    document.getElementById('vcSingleTools').style.display = mode === 'single' ? '' : 'none';   // 정렬·전체 선택은 개별 모드에서만
    updateAllButton();
}

// 버튼 만들기: 짝(묶음)마다 한 줄
function makeVarButtons() {
    const box = document.getElementById('vcButtons');
    box.innerHTML = '';
    for (const [rowName, pairs] of VC_ROWS) {
        const row = document.createElement('div');
        row.className = 'vc-row';
        row.innerHTML = `<span class="vc-group">${rowName}</span>`;
        CHART_DATA.variables.filter(v => pairs.includes(v.pair)).forEach(v => {
            const btn = document.createElement('button');
            btn.className = 'vc-btn';
            btn.textContent = v.label;
            btn.dataset.key = v.key;
            btn.onclick = () => {
                if (vcMode === 'single') { toggleVar(v, btn); updateAllButton(); }
                else pickVar(v, btn);
            };
            row.appendChild(btn);
        });
        box.appendChild(row);
    }
}

// 개별 모드: 버튼을 누르면 그 변수 막대가 추가, 다시 누르면 빠짐
function toggleVar(v, btn) {
    const chart = document.getElementById('vcChart');
    const old = chart.querySelector(`.vc-bar[data-key="${v.key}"]`);
    if (old) {
        btn.classList.remove('on');
        removeBar(old);
        return;
    }
    btn.classList.add('on');
    const g = groupOf([v.key]);
    const bar = makeBar('+ ' + v.label, g.median, g.count, 'vc-var');
    bar.dataset.key = v.key;
    chart.appendChild(bar);
    bar.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });   // 새 막대가 보이게
}

// 곱하기 모드: 고른 변수들을 모두 만족하는 작품으로 세 번째 막대 하나를 다시 계산
function pickVar(v, btn) {
    if (vcPicked.includes(v.key)) {
        vcPicked = vcPicked.filter(k => k !== v.key);       // 이미 골랐으면 빼기
        btn.classList.remove('on');
    } else {
        // 같은 줄(짝)에서 이미 고른 게 있으면 그건 빼고 새 걸로 바꾸기 (예: 지상파 → OTT)
        CHART_DATA.variables.filter(o => o.pair === v.pair && vcPicked.includes(o.key)).forEach(o => {
            vcPicked = vcPicked.filter(k => k !== o.key);
            document.querySelector(`.vc-btn[data-key="${o.key}"]`).classList.remove('on');
        });
        vcPicked.push(v.key);
        btn.classList.add('on');
    }

    const chart = document.getElementById('vcChart');
    const third = chart.querySelector('.vc-var:not(.leaving)');   // 사라지는 중인 막대는 빼고 찾기
    if (vcPicked.length === 0) {                            // 다 뺐으면 세 번째 막대도 지우기
        if (third) removeBar(third);
        vcListOpen = false;
        renderList();
        return;
    }
    const labels = vcPicked.map(k => CHART_DATA.variables.find(o => o.key === k).label);
    const label = '+ ' + labels.join(' × ');
    const g = groupOf(vcPicked);
    if (third) {
        updateBar(third, label, g.median, g.count);         // 이미 있으면 높이만 바꾸기
    } else {
        const bar = makeBar(label, g.median, g.count, 'vc-var');
        bar.classList.add('vc-clickable');                  // 누르면 작품 목록이 열리고 닫혀요
        bar.onclick = () => { vcListOpen = !vcListOpen; renderList(); };
        chart.appendChild(bar);
    }
    renderList();                                           // 목록이 열려 있으면 새 조건으로 다시 채우기
}

// 곱하기 모드 작품 목록: 세 번째 막대에 들어간 작품들의 한국어 제목 (순위 좋은 순)
function renderList() {
    const box = document.getElementById('vcList');
    if (!box) return;
    const bar = document.querySelector('#vcChart .vc-clickable:not(.leaving)');
    if (bar) bar.classList.toggle('open', vcListOpen);      // 막대 아래 ▾ / ▴ 표시 바꾸기
    if (!vcListOpen || vcPicked.length === 0) {
        box.hidden = true;
        return;
    }
    const g = groupOf(vcPicked);
    const items = g.dramas.map(d =>
        `<span class="vc-chip">${d.name}<em>상위 ${toTopPercent(d.rank).toFixed(0)}%</em></span>`).join('');
    box.innerHTML = `
        <p class="vc-list-title">세 번째 막대에 들어간 작품 · ${g.count}편</p>
        <div class="vc-chips">${items || '<span class="vc-list-empty">해당 작품이 없어요</span>'}</div>
    `;
    box.hidden = false;
}

// 개별 모드 정렬: 변수 막대만 높이 순으로 다시 줄 세우기 (비원작·웹툰원작 기본 막대 2개는 맨 앞 그대로)
// desc = 내림차순(높은 막대부터), asc = 오름차순(낮은 막대부터)
function sortBars(order) {
    const chart = document.getElementById('vcChart');
    const bars = [...chart.querySelectorAll('.vc-var:not(.leaving)')];
    bars.sort((a, b) => order === 'desc' ? a.dataset.top - b.dataset.top : b.dataset.top - a.dataset.top);
    bars.forEach(bar => chart.appendChild(bar));   // 순서대로 맨 뒤에 다시 붙이면 그 순서로 서요
    chart.scrollLeft = 0;                          // 맨 앞(기본 막대)부터 보이게
}


// 토글(details) 안에 넣은 그래프 액자(iframe)는 토글을 처음 열 때 불러와요
// (닫힌 채로 미리 그리면 그래프가 글자 크기를 못 재서 범례·축 이름이 겹치거나 사라져요)
function loadFramesOnOpen() {
    document.querySelectorAll('#detailContent iframe[data-src]').forEach(frame => {
        const box = frame.closest('details');
        if (!box) return;                          // 토글 밖 액자는 loadVisibleFrames가 맡아요
        box.addEventListener('toggle', () => {
            if (box.open && !frame.src) frame.src = frame.dataset.src;
        });
    });
}

// 토글 밖에 바로 보이는 그래프 액자는 설명 상자가 화면에 나타난 뒤에 불러와요
// (카드가 모이는 동안 상자가 숨어 있어서, 그때 그리면 축 이름이 사라져요)
function loadVisibleFrames() {
    document.querySelectorAll('#detailContent iframe[data-src]').forEach(frame => {
        if (!frame.closest('details') && !frame.src) frame.src = frame.dataset.src;
    });
}


/* ---------------------------------------------------------
   17. 분석 결과 4 · 최종 인사이트 (팀원 작업)
   - 원기둥(버튼)을 누르면 아래 설명 상자의 글이 바뀌어요
   - 글을 고치려면 아래 insights 목록만 고치면 돼요 (0번 = 첫 번째 기둥)
   --------------------------------------------------------- */
function selectResultInsight(index) {
    const root = document.querySelector('.result-clean');
    if (!root) return;

    const insights = [
        {
            tag: 'FINDING 01 · GENRE',
            title: '기존 드라마와 차별화된 장르적 경쟁력',
            text: '웹툰 원작 드라마는 독창적인 소재와 사건 중심의 전개를 통해 기존 드라마와 차별성을 보여주었으며, 특히 공포·액션·스릴러·판타지 등 고자극 장르에서 상대적으로 높은 흥행 성과가 관찰되었다.'
        },
        {
            tag: 'FINDING 02 · VISUAL STORYTELLING',
            title: '독창적인 세계관이 만들어내는 영상화 경쟁력',
            text: '웹툰 특유의 비현실적 소재와 풍부한 시각적 상상력은 영상화를 통해 새로운 볼거리와 장르적 몰입감으로 확장될 가능성이 있다.'
        },
        {
            tag: 'FINDING 03 · OTT DISTRIBUTION',
            title: 'OTT의 유연한 제작·유통 환경이 만드는 경쟁력',
            text: 'OTT는 시간과 장소의 제약을 낮추고, 기존 방송보다 유연한 표현 환경을 제공한다. 이러한 특성은 웹툰의 과감한 소재와 장르적 개성을 살리는 데 유리하며, 넷플릭스 결합 작품군에서 관찰된 우수한 성과를 설명하는 요인으로 해석할 수 있다.'
        }
    ];

    const selected = insights[index];
    if (!selected) return;

    // 선택된 원기둥 강조
    root.querySelectorAll('[data-result]').forEach(el => {
        const active = Number(el.dataset.result) === index;

        el.classList.toggle('is-active', active);
        el.setAttribute('aria-pressed', String(active));
    });

    // 설명 변경
    root.querySelector('#resultInsightTag').textContent = selected.tag;
    root.querySelector('#resultInsightTitle').textContent = selected.title;
    root.querySelector('#resultInsightText').textContent = selected.text;
}
