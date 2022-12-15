from django.urls import path
from . import views

urlpatterns = [
    path('', views.landing, name='landing'),
    path('settings', views.settings, name='settings'),
    path('datenanalyse', views.dataanalysis, name='dataanalysis'),
    path('cameralivefeed', views.livecamera, name='cameralivefeed'),
    path('testapi', views.testapi, name="testapi"),
    path('stopcameralivefeed', views.stoplivecamera, name='stopcameralivefeeded'),
    path('homedata', views.homedata, name="homedata"),
    path('config', views.get_config, name="config"),
    path('chartios', views.chart_ios, name="chartios"),
    path('movelineup', views.move_line_up, name="movelineup"),
    path('movelinedown', views.move_line_down, name="movelinedown"),
    path('firstentrytime', views.get_date_of_first_entry, name="firstentrytime"),
    path('chart/<str:start>/<str:end>', views.get_chartdata, name="chartvonbis"),
    path('test/<pk>/<pd>', views.test, name="test"),
    path('deactivateFIK/<int:day>', views.deactivateFIK, name='deactivateFIK'),
    path('updateFIK/<day>/<start>/<end>', views.updateFIK, name='updateFIK'),
]
