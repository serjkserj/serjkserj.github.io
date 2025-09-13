import os
import sys
import shutil
from pathlib import Path

def run_command(command):
    """Выполнить команду и вывести результат"""
    print(f"Выполнение: {command}")
    result = os.system(command)
    if result != 0:
        print(f"Ошибка при выполнении команды: {command}")
        return False
    return True

def create_directory(path):
    """Создать директорию (Windows-совместимая версия)"""
    path = Path(path)
    if not path.exists():
        path.mkdir(parents=True, exist_ok=True)
        print(f"Создана директория: {path}")
        return True
    return True

def main():
    print("=== Обработка изображений из .docx файлов ===")
    print()
    
    # Шаг 1: Создание структуры папок
    print("1. Создание структуры папок...")
    if not create_directory("static/docs/images"):
        print("Ошибка при создании структуры папок")
        return False
    
    # Шаг 2: Извлечение изображений из .docx файлов
    print("\n2. Извлечение изображений из .docx файлов...")
    if not run_command("python extract_images.py"):
        print("Ошибка при извлечении изображений")
        return False
    
    # Шаг 3: Переименование изображений
    print("\n3. Переименование изображений...")
    if not run_command("python rename_images.py"):
        print("Ошибка при переименовании изображений")
        return False
    
    # Шаг 4: Обновление путей в .md файлах
    print("\n4. Обновление путей к изображениям в .md файлах...")
    if not run_command("python update_markdown_paths.py"):
        print("Ошибка при обновлении путей к изображениям")
        return False
    
    # Шаг 5: Копирование старых изображений в новую структуру (если нужно)
    print("\n5. Копирование существующих изображений...")
    media_folder = Path("static/img/docs/media")
    if media_folder.exists():
        images_folder = Path("static/docs/images")
        
        # Находим все папки документов
        doc_folders = [f for f in images_folder.iterdir() if f.is_dir()]
        
        # Копируем изображения в соответствующие папки
        for image_file in media_folder.glob("*"):
            if image_file.suffix.lower() in ['.png', '.jpg', '.jpeg', '.gif', '.bmp']:
                # Определяем, в какую папку копировать
                copied = False
                for doc_folder in doc_folders:
                    # Проверяем, есть ли уже такое изображение
                    dest_path = doc_folder / image_file.name
                    if not dest_path.exists():
                        shutil.copy2(image_file, dest_path)
                        print(f"Скопировано: {image_file.name} -> {doc_folder.name}")
                        copied = True
                        break
                
                if not copied:
                    print(f"Изображение {image_file.name} уже существует во всех папках")
    
    print("\n=== Обработка завершена успешно! ===")
    print()
    print("Структура папок:")
    print("static/docs/images/")
    print("├── clashes_manager/")
    print("├── navisworks/")
    print("├── model_export/")
    print("├── svod_codes/")
    print("└── clashes_helper/")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)