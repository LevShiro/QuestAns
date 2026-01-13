<p>Команды для запуска QuestAns</p>
<p>1. Создание виртуального окружения</p>
<p># Для Windows</p>
<p>python -m venv venv</p>

<p># Для macOS/Linux</p>
<p>python3 -m venv venv</p>
<p>2. Активация виртуального окружения</p>
<p># Windows (PowerShell)</p>
<p>venv\Scripts\Activate.ps1</p>

<p># Windows (CMD)</p>
<p>venv\Scripts\activate.bat</p>

<p># macOS/Linux</p>
<p>source venv/bin/activate</p>
<p>3. Установка зависимостей из requirements.txt</p>
<p>pip install -r requirements.txt</p>
<p>4. Создание файла requirements.txt</p>
<p>pip freeze > requirements.txt</p>
<p>5. Запуск сервера Django</p>
<p>python manage.py runserver</p>
<p>6. Основные Django команды</p>
<p># Применить миграции</p>
<p>python manage.py migrate</p>

<p># Создать миграции после изменения моделей</p>
<p>python manage.py makemigrations</p>

<p># Создать суперпользователя</p>
<p>python manage.py createsuperuser</p>

<p># Запустить тесты</p>
<p>python manage.py test</p>
<p>7. Деактивация виртуального окружения</p>
<p>deactivate</p>