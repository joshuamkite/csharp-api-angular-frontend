{{/*
Expand the name of the chart.
*/}}
{{- define "loan-management.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
*/}}
{{- define "loan-management.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "loan-management.labels" -}}
helm.sh/chart: {{ include "loan-management.chart" . }}
{{ include "loan-management.selectorLabels" . }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "loan-management.selectorLabels" -}}
app.kubernetes.io/name: {{ include "loan-management.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
API specific labels
*/}}
{{- define "loan-management.api.labels" -}}
app.kubernetes.io/component: api
{{ include "loan-management.labels" . }}
{{- end }}

{{/*
API specific selector labels
*/}}
{{- define "loan-management.api.selectorLabels" -}}
app.kubernetes.io/component: api
{{ include "loan-management.selectorLabels" . }}
{{- end }}

{{/*
Frontend specific labels
*/}}
{{- define "loan-management.frontend.labels" -}}
app.kubernetes.io/component: frontend
{{ include "loan-management.labels" . }}
{{- end }}

{{/*
Frontend specific selector labels
*/}}
{{- define "loan-management.frontend.selectorLabels" -}}
app.kubernetes.io/component: frontend
{{ include "loan-management.selectorLabels" . }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "loan-management.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "loan-management.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "loan-management.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}