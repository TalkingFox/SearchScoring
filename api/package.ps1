cd src\api
dotnet lambda package
move-item .\bin\Release\netcoreapp2.1\api.zip ..\..\..\terraform\api.zip -Force
cd ..\..\