# -*- coding: utf-8 -*-
import sys
import os

try:
    from pyhwp import hwp5
    from pyhwp.hwp5 import plat
    from pyhwp.hwp5.proc import restructure
    from pyhwp.hwp5.xmlmodel import HWP5File
    
    def read_hwp_file(file_path):
        """HWP 파일을 읽어서 텍스트 추출"""
        try:
            # HWP5 형식으로 읽기
            hwp = HWP5File(file_path)
            
            # 텍스트 추출
            text_content = []
            
            # 본문 텍스트 추출
            if hasattr(hwp, 'bodytext'):
                for section in hwp.bodytext.sections:
                    for paragraph in section.paragraphs:
                        for char in paragraph.chars:
                            if hasattr(char, 'text'):
                                text_content.append(char.text)
            
            # 간단한 방법으로 텍스트 추출 시도
            try:
                # olefile을 사용한 방법
                import olefile
                if olefile.isOleFile(file_path):
                    ole = olefile.OleFileIO(file_path)
                    if 'PrvText' in ole.listdir():
                        stream = ole.openstream('PrvText')
                        content = stream.read()
                        # 인코딩 시도
                        try:
                            text = content.decode('utf-8', errors='ignore')
                            return text
                        except:
                            text = content.decode('cp949', errors='ignore')
                            return text
            except:
                pass
            
            return ''.join(text_content) if text_content else "텍스트를 추출할 수 없습니다."
            
        except Exception as e:
            # 다른 방법 시도: olefile 직접 사용
            try:
                import olefile
                if olefile.isOleFile(file_path):
                    ole = olefile.OleFileIO(file_path)
                    # BodyText 스트림 찾기
                    streams = ole.listdir()
                    for stream_name in streams:
                        if 'BodyText' in str(stream_name) or 'Section' in str(stream_name):
                            try:
                                stream = ole.openstream(stream_name)
                                content = stream.read()
                                # 바이너리에서 텍스트 추출 시도
                                text = content.decode('utf-8', errors='ignore')
                                if len(text.strip()) > 10:  # 의미있는 텍스트가 있는지 확인
                                    return text
                            except:
                                continue
            except Exception as e2:
                pass
            
            return f"오류 발생: {str(e)}"
    
    # 파일 읽기
    files = ['시니어 체육활동 프로그램.hwp', '홈페이지에 실릴 시니온.hwp']
    
    for file_name in files:
        if os.path.exists(file_name):
            print("=" * 80)
            print(f"파일: {file_name}")
            print("=" * 80)
            content = read_hwp_file(file_name)
            print(content[:5000])  # 처음 5000자만 출력
            print("\n")
            
            # 파일로 저장
            output_file = file_name.replace('.hwp', '_내용.txt')
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"내용이 {output_file}에 저장되었습니다.\n")
        else:
            print(f"파일을 찾을 수 없습니다: {file_name}")

except ImportError:
    # olefile만 사용
    try:
        import olefile
        
        def read_hwp_ole(file_path):
            if not olefile.isOleFile(file_path):
                return "HWP 파일 형식이 아닙니다."
            
            ole = olefile.OleFileIO(file_path)
            streams = ole.listdir()
            
            text_parts = []
            for stream_name in streams:
                try:
                    stream = ole.openstream(stream_name)
                    content = stream.read()
                    # 텍스트로 변환 시도
                    try:
                        text = content.decode('utf-8', errors='ignore')
                    except:
                        text = content.decode('cp949', errors='ignore')
                    
                    # 의미있는 텍스트만 추출 (한글이 포함된 경우)
                    if any('\uac00' <= char <= '\ud7a3' for char in text[:100]):
                        text_parts.append(text)
                except:
                    continue
            
            return '\n'.join(text_parts)
        
        files = ['시니어 체육활동 프로그램.hwp', '홈페이지에 실릴 시니온.hwp']
        for file_name in files:
            if os.path.exists(file_name):
                print("=" * 80)
                print(f"파일: {file_name}")
                print("=" * 80)
                content = read_hwp_ole(file_name)
                print(content[:5000])
                print("\n")
                
                output_file = file_name.replace('.hwp', '_내용.txt')
                with open(output_file, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"내용이 {output_file}에 저장되었습니다.\n")
    except ImportError:
        print("olefile 라이브러리가 필요합니다. 설치 중...")
        import subprocess
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'olefile'])
        print("다시 시도해주세요.")
