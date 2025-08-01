# 카페인 중독 앱 API 문서

## 개요

카페인 중독 관리 애플리케이션을 위한 Spring Boot 기반 REST API 문서입니다.

**기본 URL**: `/api/auth`

## 인증 시스템

- JWT 기반 Access Token (단기)
- HttpOnly 쿠키 기반 Refresh Token (30일, `/api/auth` 경로로만 전송)
- Spring Security 기반 인증/인가

## API 엔드포인트

### 1. 사용자 등록

```
POST /api/auth/register
```

**요청 본문**:

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "weight": 70.5,
  "dailyCaffeineLimit": 400
}
```

**필수 필드**:

- `email`: 이메일 주소 (필수)
- `password`: 비밀번호 (필수)
- `name`: 사용자 이름 (필수)
- `weight`: 체중 (필수)
- `dailyCaffeineLimit`: 일일 카페인 제한량 (선택)

**응답**:

- **성공 (200)**: 등록 완료
- **오류 (409)**: 이메일이 이미 존재함

### 2. 사용자 로그인

```
POST /api/auth/login
```

**요청 본문**:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**응답**:

- **성공 (200)**:
  ```json
  {
    "code": 200,
    "status": "SUCCESS",
    "message": "SUCCESS",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
  - `Set-Cookie` 헤더를 통해 refreshToken 설정 (HttpOnly, Secure, SameSite=Strict, 30일)
- **오류 (401)**: 로그인 실패

### 3. 토큰 갱신

```
POST /api/auth/refresh
```

**요청**: refreshToken 쿠키 필요

**응답**:

- **성공 (200)**:
  ```json
  {
    "code": 200,
    "status": "SUCCESS",
    "message": "SUCCESS",
    "newToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
  - 새로운 refreshToken 쿠키 설정
- **오류 (403)**: 유효하지 않은 refresh token
- **오류 (401)**: 만료된 refresh token

### 4. 사용자 로그아웃

```
POST /api/auth/logout
```

**요청**: 인증 토큰 필요

**응답**:

- **성공 (200)**: 로그아웃 완료, refreshToken 쿠키 삭제 (maxAge=0)
- **오류 (403)**: 유효하지 않은 토큰

### 5. 사용자 정보 조회

```
GET /api/auth/user/info
```

**요청**: 인증 토큰 필요 (`@AuthenticationPrincipal`이 자동으로 userId 추출)

**응답**:

- **성공 (200)**:
  ```json
  {
    "code": 200,
    "status": "SUCCESS",
    "message": "SUCCESS",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "weight": 70.5,
      "dailyCaffeineLimit": 400
    }
  }
  ```
- **오류 (404)**: 사용자를 찾을 수 없음

### 6. 사용자 정보 수정

```
PATCH /api/auth/user/edit
```

**요청**: 인증 토큰 필요

**요청 본문** (모든 필드 선택사항):

```json
{
  "email": "newemail@example.com",
  "name": "New Name",
  "weight": 75.0,
  "dailyCaffeineLimit": 350
}
```

**응답**:

- **성공 (200)**: 정보 업데이트 완료
- **오류 (409)**: 이메일이 이미 존재함
- **오류 (404)**: 사용자를 찾을 수 없음

## 공통 응답 형식

모든 API는 다음과 같은 공통 응답 구조를 사용합니다:

```json
{
  "code": 200,
  "status": "SUCCESS",
  "message": "SUCCESS"
}
```

## 오류 코드

- `200`: 성공
- `401`: 인증 실패 (로그인 실패, 토큰 만료)
- `403`: 금지됨 (유효하지 않은 토큰)
- `404`: 찾을 수 없음 (사용자를 찾을 수 없음)
- `409`: 충돌 (이메일 중복)

## 보안 설정

- JWT 토큰 기반 인증
- 비밀번호 암호화 (BCrypt)
- CORS 설정
- CSRF 보호
- Refresh Token 보안을 위한 HttpOnly 쿠키
- SameSite=Strict 쿠키 설정
