package org.vaccineimpact.api

import me.ntrrgc.tsGenerator.ClassTransformer
import me.ntrrgc.tsGenerator.TypeScriptGenerator
import me.ntrrgc.tsGenerator.camelCaseToSnakeCase
import org.vaccineimpact.api.models.*
import java.io.File
import java.time.LocalDate
import java.time.LocalDateTime
import java.sql.Timestamp
import kotlin.reflect.KClass
import kotlin.reflect.KProperty
import kotlin.system.exitProcess

fun main(args: Array<String>)
{
    if (args.size != 1)
    {
        println("Please specify the output path as the single command line parameter.")
        println("Output path should be the path to a .ts file.")
        exitProcess(-1)
    }
    else
    {
        val outputPath = args.first()
        println("Generating TypeScript model interfaces and storing in $outputPath")

        val generator = TypeScriptGenerator(
                rootClasses = setOf(
                        CoverageSet::class,
                        Disease::class,
                        DemographicStatisticType::class,
                        ModellingGroup::class,
                        ModellingGroupDetails::class,
                        Responsibilities::class,
                        Result::class,
                        Scenario::class,
                        ScenarioAndCoverageSets::class,
                        ScenarioTouchstoneAndCoverageSets::class,
                        Touchstone::class,
                        TouchstoneStatus::class,
                        User::class,
                        AssociateUser::class,
                        org.vaccineimpact.api.models.permissions.AssociateRole::class
                ),
                mappings = mapOf(
                        LocalDateTime::class to "Date",
                        LocalDate::class to "Date",
                        Timestamp::class to "Date"
                ),
                ignoreSuperclasses = setOf(Iterable::class, HasKey::class),
                classTransformers = listOf(
                        SnakeCaseTransformer
                ),
                addExportStatements = true,
                enumTransformer = ::transformEnum
        )
        val text = "// Code generated by a tool.\n// Run `npm run generate-models` to regenerate\n\n${generator.definitionsText}"
        println()
        File(outputPath).writeText(text)
    }
}

fun transformEnum(klass: KClass<*>, value: Any): String {
    var asString = value.toString();
    asString = when (value)
    {
        GAVISupportLevel.NONE -> "no vaccine"
        GAVISupportLevel.WITHOUT -> "no gavi"
        GAVISupportLevel.WITH -> "total"
        else -> asString
    }
    return asString.toLowerCase().replace('_', '-')
}

object SnakeCaseTransformer : ClassTransformer
{
    override fun transformPropertyName(propertyName: String, property: KProperty<*>, klass: KClass<*>): String
    {
        return camelCaseToSnakeCase(propertyName)
    }
}