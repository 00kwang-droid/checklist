# Kardian Daily Checklist

신한펀드파트너스 카디안(Kardian) Daily NAV and Valuation Review 체크리스트를 팀원과 함께 작성하고,
완료된 내용을 PDF로 만들어 고객사에 메일로 보낼 수 있는 설치형 웹앱(PWA)입니다.

원본 `카디안체크리스트.xlsx`의 항목/설명/레이아웃을 그대로 반영했습니다.

## 주요 기능

- **날짜 자동 설정** — 상단 Date는 오늘 날짜로 자동 표시됩니다. 데이터도 날짜별로 저장됩니다.
- **No. of Count** — 숫자만 입력 가능한 입력창.
- **Checking Result (Y/N)** — 기본값 Y, 버튼으로 Y/N 전환. 섹션 제목 행(엑셀의 보라색 행: 1. Creation of static data, 2. Prices update 등)은 입력란 자체가 없어 값을 넣을 수 없습니다.
- **설명(i) 버튼** — 엑셀 E열에 있던 설명이 있는 항목만 "i" 아이콘이 표시되고, 누르면 설명 팝업이 뜹니다.
- **금일 특이사항** — "금일 특이사항 없습니다." 문구가 기본값으로 들어가 있으며 자유롭게 수정 가능합니다.
- **체크자 / 확인자 서명** — 이름은 키보드로 입력하고, 서명은 은행 서명패드처럼 화면(마우스/터치)에 직접 그릴 수 있습니다.
- **PDF 저장** — 화면에 보이는 체크리스트 영역만(설정/버튼 제외) PDF로 캡처합니다.
- **메일 발송** — 보내는 사람(kskim01@shinhan.com) → 받는 사람(00kwang@gmail.com)으로 PDF가 첨부된 메일을 자동 발송합니다. 주소는 설정 화면에서 언제든 변경할 수 있습니다.
- **팀 공유** — Firebase Firestore를 연결하면 같은 날짜의 체크리스트를 팀원들이 실시간으로 함께 작성할 수 있습니다(선택 사항). 연결하지 않으면 각자의 기기(브라우저)에만 저장됩니다.
- **설치형 웹앱(PWA)** — GitHub Pages로 배포 후 휴대폰/PC에서 "홈 화면에 추가" 또는 "설치"로 앱처럼 사용할 수 있습니다.

## 이메일 자동 발송을 위해 꼭 필요한 설정 — EmailJS

브라우저(클라이언트)에서 실제 메일 서버로 메일을 직접 보낼 수는 없기 때문에, 이 앱은 **EmailJS**(무료 플랜 있음)라는 중계 서비스를 사용합니다.

1. https://www.emailjs.com 에서 무료 계정 생성
2. **Email Services**에서 보내는 사람 메일(kskim01@shinhan.com이 속한 회사 SMTP 또는 Gmail 등)을 연결해 Service ID 확인
3. **Email Templates**에서 새 템플릿을 만들고, 아래 변수를 사용:
   - `{{to_email}}`, `{{from_email}}`, `{{subject}}`, `{{message}}`
   - 템플릿 설정의 **Attachments**에서 "Dynamic content"를 선택하고 변수명을 `pdf_attachment`(base64), 파일명 변수를 `pdf_filename`으로 지정하면 앱에서 생성한 PDF가 메일에 자동 첨부됩니다.
   - (EmailJS 무료 플랜은 첨부파일 용량 제한이 있습니다. 체크리스트 1장 분량의 PDF는 보통 문제없이 들어갑니다.)
4. **Account > General**에서 Public Key 확인
5. 앱의 **설정** 탭 > "EmailJS 발송 설정"에 Service ID / Template ID / Public Key 입력 후 저장

EmailJS를 설정하지 않아도 앱은 동작합니다 — "메일 발송" 버튼을 누르면 PDF를 자동으로 다운로드해주고, 메일 앱이 열리니 그 PDF 파일만 수동으로 첨부해서 보내면 됩니다.

## 팀원 간 같은 파일 공유를 위해 필요한 설정 — Firebase (선택)

1. https://console.firebase.google.com 에서 무료 프로젝트 생성
2. 왼쪽 메뉴 **Firestore Database** > 데이터베이스 만들기 (테스트 모드로 시작 가능)
3. **프로젝트 설정(톱니바퀴) > 일반 > 내 앱 > 웹 앱 추가** 후 나오는 `firebaseConfig` 객체(JSON)를 복사
4. 앱의 **설정** 탭 > "팀 공유(Firebase)"에 그대로 붙여넣고 저장
5. **같은 firebaseConfig 값을 팀원 모두 동일하게 입력**하면, 같은 날짜의 체크리스트를 실시간으로 함께 작성하게 됩니다.

> Firestore 보안 규칙: 사내 전용으로만 쓸 경우 테스트 모드(공개 읽기/쓰기)로 충분하지만, 외부 노출이 걱정되면 Firestore 규칙에서 팀 도메인/이메일 인증을 추가하는 것을 권장합니다. 필요하면 도와드릴 수 있습니다.

## GitHub Pages로 배포하기 (설치 가능한 웹앱 만들기)

이 폴더 전체(`index.html`, `manifest.json`, `sw.js`, `icons/`)를 본인 GitHub 계정의 새 저장소에 올리면 됩니다.

```bash
# 1) 이 폴더에서 그대로 실행
git init
git add .
git commit -m "Kardian daily checklist PWA"

# 2) GitHub에서 새 저장소를 만든 뒤 (예: kardian-checklist), 원격 주소 연결
git branch -M main
git remote add origin https://github.com/<본인계정>/kardian-checklist.git
git push -u origin main
```

3. GitHub 저장소 **Settings > Pages**로 이동
4. **Source**를 `Deploy from a branch`로, **Branch**를 `main` / `/(root)`로 선택 후 저장
5. 잠시 후 `https://<본인계정>.github.io/kardian-checklist/` 주소로 접속 가능

### 휴대폰/PC에 앱처럼 설치하기

- **iPhone (Safari)**: 위 주소 접속 → 공유 버튼 → "홈 화면에 추가"
- **Android (Chrome)**: 위 주소 접속 → 메뉴(⋮) → "앱 설치" 또는 "홈 화면에 추가"
- **PC (Chrome/Edge)**: 주소창 오른쪽의 설치 아이콘 클릭

## 파일 구성

```
kardian-checklist/
├─ index.html      ← 앱 전체 (UI + 로직)
├─ manifest.json    ← PWA 설치 정보
├─ sw.js            ← 오프라인/설치를 위한 서비스워커
├─ icons/
│   ├─ icon-192.png
│   └─ icon-512.png
└─ README.md
```

## 참고 / 제한사항

- 서명과 체크리스트 데이터는 기본적으로 브라우저의 localStorage(기기별 저장)에 저장되며, Firebase를 연결하면 팀 전체가 공유하는 클라우드 저장소에 실시간 저장됩니다.
- PDF는 화면의 체크리스트 카드 영역만 캡처하므로, 설정 화면이나 버튼 등은 PDF에 포함되지 않습니다.
- 메일 발송은 EmailJS 무료 플랜 기준 월 발송 건수 제한이 있습니다(2026년 기준 약 200건/월). 매일 발송하는 용도로는 충분하지만, 팀원이 여러 명이라면 유료 플랜을 고려하세요.
